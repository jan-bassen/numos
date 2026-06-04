'use client'

import type { ImageType, InsertUpload } from '@/types/database.types'
import { insertUploads, revalidateUploads } from '@/lib/data/uploads'
import { putBlob } from '@/lib/data/store'
import type { RefObject } from 'react'
import { validImageExtensions, validImageTypes } from './file-types'
import { toast } from 'sonner'

/** Broadcast so the uploads view can re-read the store after a change. */
export const UPLOADS_CHANGED_EVENT = 'numos:uploads-changed'
function notifyUploadsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(UPLOADS_CHANGED_EVENT))
  }
}

export async function handleFileUpload(
  version: string,
  folder: string | null,
  files: File[] | null,
  fileInputRef: RefObject<HTMLInputElement | null> | null,
): Promise<void> {
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

  const consolidatedPromise = (async () => {
    for (const [id, file] of Object.entries(fileMap)) {
      await putBlob(id, file)
    }
  })()

  toast.promise(consolidatedPromise, {
    loading: 'Uploading...',
    success: () => {
      revalidateUploads()
      notifyUploadsChanged()
      return 'Successfully uploaded'
    },
    error: (error: string) => error,
  })
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
): Promise<{ ok: boolean; message?: string | null }> {
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
  URL.revokeObjectURL(img.src)
  return {
    width,
    height,
  }
}
