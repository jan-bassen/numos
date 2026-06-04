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
import {
  bulkPut,
  get,
  getAllBy,
  getBlob,
  newId,
  patch,
  put,
  remove,
  removeBlob,
  removeMany,
} from './store'

const now = () => new Date().toISOString()

/** No-op: data lives client-side now, nothing to revalidate. */
export async function revalidateUploads() {}

export async function insertUploads(
  uploads: InsertUpload[],
): Promise<ReturnInfo> {
  const rows: Upload[] = uploads.map((upload) => ({
    id: upload.id ?? newId(),
    version: upload.version,
    folder: upload.folder ?? null,
    name: upload.name ?? null,
    type: upload.type,
    bytes: upload.bytes,
    width: upload.width,
    height: upload.height,
    tags: upload.tags ?? null,
    created_at: now(),
    updated_at: now(),
  }))
  await bulkPut('uploads', rows)
  return { ok: true, message: 'Layers added' }
}

export async function updateUpload(
  id: string,
  upload: UpdateUpload,
): Promise<ReturnInfo> {
  const updated = await patch<Upload>('uploads', id, upload)
  if (!updated) {
    return { ok: false, message: 'Upload not found' }
  }
  return { ok: true, message: 'Layer updated' }
}

export async function moveUploadsAndFolders(
  uploads: string[],
  folders: string[],
  folder: string | null,
) {
  for (const id of uploads) {
    await patch<Upload>('uploads', id, { folder })
  }
  for (const id of folders) {
    await patch<Folder>('folders', id, { parent: folder })
  }
  return { ok: true, message: 'Layers and folders moved' }
}

export async function deleteUpload(id: string): Promise<ReturnInfo> {
  await remove('uploads', id)
  await removeBlob(id)
  return { ok: true, message: 'Layer deleted' }
}

export async function deleteUploads(ids: string[]) {
  await removeMany('uploads', ids)
  for (const id of ids) {
    await removeBlob(id)
  }
  return { ok: true, message: 'Uploads deleted' }
}

export async function insertFolder(folder: InsertFolder): Promise<ReturnInfo> {
  await put<Folder>('folders', {
    id: folder.id ?? newId(),
    version: folder.version,
    name: folder.name ?? null,
    parent: folder.parent ?? null,
    created_at: now(),
  })
  return { ok: true, message: 'Successfully inserted folder' }
}

export async function updateFolder(
  id: string,
  folder: UpdateFolder,
): Promise<ReturnInfo> {
  const updated = await patch<Folder>('folders', id, folder)
  if (!updated) {
    return { ok: false, message: 'Folder not found' }
  }
  return { ok: true, message: 'Successfully updated folder' }
}

export async function deleteFolder(id: string): Promise<ReturnInfo> {
  await remove('folders', id)
  return { ok: true, message: 'Folder deleted' }
}

export async function deleteFolders(ids: string[]) {
  await removeMany('folders', ids)
  return { ok: true, message: 'Folders deleted' }
}

export async function getAllUploads(version: string) {
  const uploads = await getAllBy<Upload>('uploads', 'version', version)
  return uploads.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
}

/**
 * Former Supabase `signUploads`: resolve each upload to a displayable URL. With
 * client-side storage that's an object URL minted from the stored blob.
 */
export async function signUploads(
  _version: string,
  uploads: Upload[],
): Promise<ResolvedUpload[]> {
  if (uploads.length === 0) return []
  const resolved: ResolvedUpload[] = []
  for (const upload of uploads) {
    const blob = await getBlob(upload.id)
    resolved.push({
      ...upload,
      signedUrl: blob ? URL.createObjectURL(blob) : '',
    })
  }
  return resolved
}

export async function getAllSignedUploads(version: string) {
  const uploads = await getAllUploads(version)
  return signUploads(version, uploads)
}

export async function getAllFolders(version: string) {
  const folders = await getAllBy<Folder>('folders', 'version', version)
  return folders.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
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
      const folderPath = []
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
