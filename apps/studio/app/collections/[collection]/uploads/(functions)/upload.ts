'use client'

import * as tus from 'tus-js-client'
import { createSupabaseClient } from '@/lib/supabase/clients/client'
import type { ImageType, InsertUpload } from '@/types/database.types'
import {
  deleteUpload,
  insertUploads,
  revalidateUploads,
} from '@/lib/supabase/db/uploads'
import type { RefObject } from 'react'

import { RestrictionError } from '@uppy/core/lib/Restricter'
import { validImageExtensions, validImageTypes } from './file-types'
import { toast } from 'sonner'

export async function handleFileUpload(
  version: string,
  folder: string | null,
  files: File[] | null,
  fileInputRef: RefObject<HTMLInputElement | null> | null,
) {
  if (!files) return
  const fileMap: Record<string, File> = {}
  for (const file of files) {
    fileMap[crypto.randomUUID()] = file
  }
  if (fileInputRef?.current) {
    fileInputRef.current.value = ''
    fileInputRef.current.files = null
  }

  const res = await createLayerEntries(version, folder, fileMap)
  if (!res.ok) {
    toast.error(res.message)
    return
  }
  const promises: Promise<string>[] = []
  for (const [id, file] of Object.entries(fileMap)) {
    try {
      const promise = uploadFile('uploads', version, id, file)
      promises.push(promise)
    } catch (err) {
      if (err instanceof RestrictionError) {
        if (err.isUserFacing) {
          toast.error(err.message)
        }
      } else {
        throw err
      }
    }
  }
  const consolidatedPromise = Promise.all(promises)
  toast.promise(consolidatedPromise, {
    loading: 'Uploading...',
    success: () => {
      revalidateUploads()
      return 'Successfully uploaded'
    },
    error: (error: string) => {
      return error
    },
  })
}

export async function uploadFile(
  bucketName: string,
  folder: string,
  fileId: string,
  file: File,
) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) {
    throw new Error('Error with fetching session')
  }
  const session = data.session

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing database service key environment variable')
  }
  const fileName = `${folder}/${fileId}`

  return new Promise(
    (resolve: (id: string) => void, reject: (reason?: string) => void) => {
      const newFile = new File([file], fileName, { type: file.type })

      const upload = new tus.Upload(newFile, {
        endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
        metadata: {
          bucketName: bucketName,
          objectName: fileName,
          contentType: file.type,
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
        onError: (error) => {
          deleteUpload(fileId)
          reject(error.message)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
          console.log(bytesUploaded, bytesTotal, `${percentage}%`)
        },
        onSuccess: () => {
          console.log('Download %s from %s', fileName, upload.url)
          resolve(fileId)
        },
      })

      // Check if there are any previous uploads to continue.
      return upload.findPreviousUploads().then((previousUploads) => {
        // Found previous uploads so we select the first one.
        if (previousUploads[0]) {
          upload.resumeFromPreviousUpload(previousUploads[0])
        }

        // Start the upload
        upload.start()
      })
    },
  )
}

const verifyFile = (
  file: File,
  plural: boolean,
): { type: ImageType; name: string; bytes: number } => {
  if (!file.type.startsWith('image/')) {
    throw new Error('File type must be an image')
  }
  const subtype = file.type.slice(6)
  if (!validImageTypes.includes(subtype as ImageType)) {
    throw new Error(
      plural
        ? 'All files must be of a standard image type'
        : 'File must be of a standard image type',
    )
  }
  if (file.name.length > 256) {
    throw new Error(
      plural
        ? 'All files must be less than 256 characters'
        : 'File must be less than 256 characters',
    )
  }
  if (file.size > 1024 * 1024 * 10) {
    //10 MB
    throw new Error(
      plural
        ? 'All files must be less than 10 MB'
        : 'File must be less than 10 MB',
    )
  }

  return { type: subtype as ImageType, name: file.name, bytes: file.size }
}

export async function createLayerEntries(
  version: string,
  folder: string | null,
  files: Record<string, File>,
) {
  const plural = Object.keys(files).length > 1
  const layerEntries: InsertUpload[] = []
  for (const [id, file] of Object.entries(files)) {
    try {
      const { type, name, bytes } = verifyFile(file, plural)
      const possibleExtension = name.split('.').pop()
      let newName = name
      if (
        possibleExtension &&
        validImageExtensions.includes(possibleExtension)
      ) {
        newName = name.split('.').slice(0, -1).join('.')
      }
      const { width, height } = await getImageDimensions(file)
      const layer: InsertUpload = {
        id,
        version: version,
        folder: folder,
        name: newName,
        type,
        bytes,
        width,
        height,
      }
      layerEntries.push(layer)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { ok: false, message: error.message }
      }
      return {
        ok: false,
        message: plural
          ? 'Unknown error with one of the files'
          : 'Unknown error with file',
      }
    }
  }

  return await insertUploads(layerEntries)
}

async function getImageDimensions(file: File) {
  const img = new Image()
  img.src = URL.createObjectURL(file)
  await img.decode()
  const width = img.width
  const height = img.height
  return {
    width,
    height,
  }
}
