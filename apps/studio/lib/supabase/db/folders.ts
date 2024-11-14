'use server'

import type {
  EmptyFolder,
  InsertEmptyFolder,
  ReturnInfo,
} from '@/types/database.types'
import { createSupabaseServerComponentClient } from '../clients/server-client'
import { revalidatePath } from 'next/cache'
import type { EmptyFolderObject } from '../storage/user-images'

export async function addEmptyFolder(
  folder: InsertEmptyFolder,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const newFolder = {
    ...folder,
    path: folder.path || null,
  }
  const { error } = await supabase.from('empty_folders').insert([newFolder])
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/assets', 'page')
  return { ok: true, message: 'Successfully created' }
}

export async function renameEmptyFolder(
  id: string,
  newName: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('empty_folders')
    .update({ label: newName })
    .eq('id', id)
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/assets')
  return { ok: true, message: 'Successfully renamed' }
}

export async function moveEmptyFolder(
  id: string,
  newPath: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('empty_folders')
    .update({ path: newPath })
    .eq('id', id)
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/assets')
  return { ok: true, message: 'Successfully moved' }
}

export async function deleteEmptyFolder(id: string): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('empty_folders').delete().eq('id', id)
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/assets')
  return { ok: true, message: 'Successfully deleted' }
}

export async function getEmptyFolders(collectionId: string, path?: string) {
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = path
    ? await supabase
        .from('empty_folders')
        .select()
        .eq('collection', collectionId)
        .eq('path', path)
    : await supabase
        .from('empty_folders')
        .select()
        .eq('collection', collectionId)
        .is('path', null)

  if (error) {
    throw new Error('Error with fetching folders')
  }
  return data
}

export async function getEmptyFoldersAsFileObjects(
  collectionId: string,
  path?: string,
): Promise<EmptyFolderObject[]> {
  const folders = await getEmptyFolders(collectionId, path)

  return folders.map((folder) => ({
    id: folder.id,
    name: folder.label,
    path: folder.path
      ? `${folder.collection}/${folder.path}`
      : folder.collection,
    fullPath: folder.path
      ? `${folder.collection + folder.path}/${folder.label}`
      : `${folder.collection}/${folder.label}`,
    folderPath: folder.path ? `${folder.path}/${folder.label}` : folder.label,
    type: 'empty-folder',
  }))
}

export async function getCurrentEmptyFolder(
  collectionId: string,
  currentPath: string,
): Promise<EmptyFolder | undefined> {
  const supabase = await createSupabaseServerComponentClient()

  console.log(currentPath)
  console.log(collectionId)

  const path = currentPath.split('/').slice(0, -1).join('/') || null
  const label = currentPath.split('/').slice(-1)[0]
  console.log(path, label)

  if (!label) {
    return
  }
  if (path === null) {
    const { data, error } = await supabase
      .from('empty_folders')
      .select()
      .eq('collection', collectionId)
      .eq('label', label)
      .is('path', null)

    if (error) {
      throw new Error('Error with fetching folder')
    }
    return data[0] || undefined
  }
  const { data, error } = await supabase
    .from('empty_folders')
    .select()
    .eq('collection', collectionId)
    .eq('label', label)
    .eq('path', path)

  if (error) {
    throw new Error('Error with fetching folder')
  }
  return data[0] || undefined
}
