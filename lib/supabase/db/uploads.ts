'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import type {
  Folder,
  InsertFolder,
  InsertUpload,
  Upload,
  UploadsTree,
  ResolvedFolder,
  ReturnInfo,
  ResolvedUpload,
  UpdateFolder,
  UpdateUpload,
} from '@/types/database.types'

export async function revalidateUploads() {
  revalidatePath('/collections/[collection]/layers', 'page')
}

export async function insertUploads(
  uploads: InsertUpload[],
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('uploads').insert(uploads)
  if (error) {
    return { ok: false, message: error.message }
  }
  return { ok: true, message: 'Layers added' }
}

export async function updateUpload(
  id: string,
  upload: UpdateUpload,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('uploads').update(upload).eq('id', id)
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/uploads', 'page')
  return { ok: true, message: 'Layer updated' }
}

export async function moveUploadsAndFolders(
  uploads: string[],
  folders: string[],
  folder: string | null,
) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('uploads')
    .update({ folder: folder })
    .in('id', uploads)
  const { error: folderError } = await supabase
    .from('folders')
    .update({ parent: folder })
    .in('id', folders)

  if (error) {
    return { ok: false, message: error.message }
  }
  if (folderError) {
    return { ok: false, message: folderError.message }
  }
  revalidatePath('/collections/[collection]/uploads', 'page')
  return { ok: true, message: 'Layers and folders moved' }
}

export async function deleteUpload(id: string): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('uploads').delete().eq('id', id)
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/uploads', 'page')
  return { ok: true, message: 'Layer deleted' }
}

export async function deleteUploads(ids: string[]) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('uploads').delete().in('id', ids)
  if (error) {
    return { ok: false, message: 'Error with deleting uploads' }
  }
  revalidatePath('/collections/[collection]/uploads', 'page')
  return { ok: true, message: 'Uploads deleted' }
}

export async function insertFolder(folder: InsertFolder): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('folders').insert(folder)
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/uploads', 'page')
  return { ok: true, message: 'Successfully inserted folder' }
}

export async function updateFolder(
  id: string,
  folder: UpdateFolder,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('folders').update(folder).eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/uploads', 'page')
  return { ok: true, message: 'Successfully updated folder' }
}

export async function deleteFolder(id: string): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase.from('folders').delete().eq('id', id)

  if (error) {
    return { ok: false, message: 'Error with deleting folder' }
  }
  revalidatePath('/collections/[collection]/uploads', 'page')
  return { ok: true, message: 'Folder deleted' }
}

export async function deleteFolders(ids: string[]) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('folders').delete().in('id', ids)
  if (error) {
    return { ok: false, message: 'Error with deleting folder' }
  }
  revalidatePath('/collections/[collection]/uploads', 'page')
  return { ok: true, message: 'Folders deleted' }
}

export async function getAllUploads(version: string) {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('uploads')
    .select()
    .eq('version', version)
    .order('name', { ascending: true })

  if (error) {
    throw new Error('Error with fetching uploads')
  }
  return data
}

export async function signUploads(
  version: string,
  uploads: Upload[],
): Promise<ResolvedUpload[]> {
  const supabase = await createSupabaseServerComponentClient()

  if (uploads.length === 0) return []

  const paths = uploads.map((upload) => {
    return `${version}/${upload.id}`
  })

  const { data: signedUrlsData, error } = await supabase.storage
    .from('uploads')
    .createSignedUrls(paths, 3600)

  if (error) {
    throw new Error(`Error with fetching signed urls: ${error.message}`)
  }
  return uploads.map((upload, index) => {
    const signedUrlData = signedUrlsData[index]
    if (!signedUrlData) throw new Error('Signed url data not found')
    const { error, signedUrl } = signedUrlData
    if (error) {
      throw new Error(`Error with fetching signed url: ${error}`)
    }
    return {
      ...upload,
      signedUrl,
    }
  })
}

export async function getAllSignedUploads(version: string) {
  const uploads = await getAllUploads(version)
  return signUploads(version, uploads)
}

export async function getAllFolders(version: string) {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('folders')
    .select()
    .eq('version', version)
    .order('name', { ascending: true })

  if (error) {
    throw new Error('Error with fetching folders')
  }
  return data
}

export async function getUploadsTree(version: string): Promise<UploadsTree> {
  const uploads = await getAllSignedUploads(version)
  const folders = await getAllFolders(version)

  const signedUploadMap = uploads.reduce(
    (acc, upload) => {
      acc[upload.id] = upload
      return acc
    },
    {} as Record<string, ResolvedUpload>,
  )

  const folderMap = folders.reduce(
    (acc, folder) => {
      acc[folder.id] = folder
      return acc
    },
    {} as Record<string, Folder>,
  )

  const resolvedFolderMap = folders.reduce(
    (acc, folder) => {
      const folderPath: string[] = []
      let nextParent = folder.parent
      while (nextParent) {
        folderPath.unshift(nextParent)
        const parent = folderMap[nextParent]
        if (!parent) {
          nextParent = null
          throw new Error('Reference to non-existing folder')
        }
        if (folder.id === parent.id || folder.id === parent.parent) {
          nextParent = null
          throw new Error('Reference to self')
        }
        nextParent = parent.parent
      }
      acc[folder.id] = {
        ...folder,
        subfolders: folders
          .filter((f) => f.parent === folder.id)
          .map((f) => f.id),
        uploads: uploads.filter((u) => u.folder === folder.id).map((u) => u.id),
        path: folderPath,
      }
      return acc
    },
    {} as Record<string, ResolvedFolder>,
  )

  return {
    folders: resolvedFolderMap,
    uploads: signedUploadMap,
  }
}
