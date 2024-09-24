'use server'

import { createSupabaseClient } from '../client'
import type { SupabaseClient } from '@supabase/supabase-js'
import { FetchError } from '@/lib/errors'
import { revalidatePath } from 'next/cache'
import type { FileObject } from '@supabase/storage-js'

export type FileObjectExtra = {
  path: string
  fullPath: string
  folderPath: string
  type: 'folder' | 'file' | 'empty-folder'
  signedUrl?: string
}

export type FullFileObject = ImageFileObject

export type FolderObject = {
  path: string
  fullPath: string
  folderPath: string
  type: 'folder'
  children: FolderObject[]
} & FileObject

export type ImageFileObject = {
  path: string
  fullPath: string
  folderPath: string
  type: 'file'
} & FileObject

export type EmptyFolderObject = {
  id: string
  name: string
  path: string
  fullPath: string
  folderPath: string
  type: 'empty-folder'
}

export type FullFolderObject = FolderObject | EmptyFolderObject

export type NestedFullFileObject = FolderObject | ImageFileObject

async function getFilesAtPath(
  supabase: SupabaseClient,
  path: string,
): Promise<NestedFullFileObject[]> {
  const { data: paths, error: listError } = await supabase.storage
    .from('user-images')
    .list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

  if (listError) {
    throw new Error('Error fetching image list')
  }

  if (!paths || paths.length === 0) {
    return []
  }

  const fullFileObjects = paths.map((p) => {
    const obj = p.id
      ? {
          ...p,
          path: path,
          fullPath: `${path}/${p.name}`,
          folderPath: `${path}/${p.name}`.split('/').slice(1).join('/'),
          type: 'file' as const,
        }
      : {
          ...p,
          path: path,
          fullPath: `${path}/${p.name}`,
          folderPath: `${path}/${p.name}`.split('/').slice(1).join('/'),
          children: [],
          type: 'folder' as const,
        }
    return obj
  })

  return fullFileObjects
}

async function flattenFolder(
  supabase: SupabaseClient,
  basepath: string,
  paths: FileObject[],
): Promise<FullFileObject[]> {
  const images: FullFileObject[] = []
  for (const path of paths) {
    if (!path.id) {
      const subpaths = await getFilesAtPath(
        supabase,
        `${basepath}/${path.name}`,
      )
      const subimages = await flattenFolder(
        supabase,
        `${basepath}/${path.name}`,
        subpaths,
      )
      images.push(...subimages)
    } else {
      images.push({
        ...path,
        path: basepath,
        fullPath: `${basepath}/${path.name}`,
        folderPath: `${basepath}/${path.name}`.split('/').slice(1).join('/'),
        type: 'file',
      })
    }
  }
  return images
}

async function fillFolder(
  supabase: SupabaseClient,
  basepath: string,
  paths: FileObject[],
): Promise<NestedFullFileObject[]> {
  const images: NestedFullFileObject[] = []
  for (const path of paths) {
    if (!path.id) {
      const subpaths = await getFilesAtPath(
        supabase,
        `${basepath}/${path.name}`,
      )
      const subimages = await fillFolder(
        supabase,
        `${basepath}/${path.name}`,
        subpaths,
      )
      images.push({
        ...path,
        path: basepath,
        fullPath: `${basepath}/${path.name}`,
        folderPath: `${basepath}/${path.name}`.split('/').slice(1).join('/'),
        children: subimages,
        type: 'folder',
      } as FolderObject)
    } else {
      images.push({
        ...path,
        path: basepath,
        fullPath: `${basepath}/${path.name}`,
        folderPath: `${basepath}/${path.name}`.split('/').slice(1).join('/'),
        type: 'file',
      })
    }
  }
  return images
}

export async function getAllUserImages(collectionId: string) {
  const supabase = await createSupabaseClient()

  const paths = await getFilesAtPath(supabase, collectionId)
  const images = await flattenFolder(supabase, collectionId, paths)
  return images
}

async function getUserImageURLs(
  supabase: SupabaseClient,
  images: NestedFullFileObject[],
) {
  const imageNames = images
    .filter((image) => image.id)
    .map((image) => {
      return image.fullPath
    })

  const { data, error } = await supabase.storage
    .from('user-images')
    .createSignedUrls(imageNames, 3600)

  if (error) {
    throw new Error('Error fetching image urls: ' + error.message)
  }

  const imageOptions: { [key: string]: { url: string } } = {}

  for (const option of data) {
    if (!option.signedUrl || !option.path) return
    const folderPath = option.path.split('/').slice(1).join('/')
    imageOptions[folderPath] = { url: option.signedUrl }
  }

  return imageOptions
}

export async function getFullImageFiles(path: string) {
  const supabase = await createSupabaseClient()
  const images = await getFilesAtPath(supabase, path)
  const imageUrls = await getUserImageURLs(supabase, images)
  return { images, imageUrls }
}

export async function getImageFiles(path: string) {
  const supabase = await createSupabaseClient()
  const images = await getFilesAtPath(supabase, path)
  return images
}

export async function getNestedFullImageFiles(collectionId: string) {
  const supabase = await createSupabaseClient()
  const paths = await getFilesAtPath(supabase, collectionId)
  const images = await fillFolder(supabase, collectionId, paths)
  return images
}

export async function getSignedUploadURL(path: string) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.storage
    .from('user-images')
    .createSignedUploadUrl(path)
  if (error) {
    throw new FetchError(error.message)
  }
  return data
}

export async function deleteImage(path: string) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.storage
    .from('user-images')
    .remove([path])

  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/studio/[collection]/layers', 'page')
  return {
    ok: true,
    message: 'Successfully deleted',
  }
}

export async function deleteImages(paths: string[]) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.storage
    .from('user-images')
    .remove(paths)
  if (data) revalidatePath('/studio/[collection]/layers', 'page')
  if (error) {
    throw new FetchError(error.message)
  }
  return data
}

export async function deleteFolder(path: string) {
  const supabase = await createSupabaseClient()

  const childPaths = await getFilesAtPath(supabase, path)
  const allPaths = await flattenFolder(supabase, path, childPaths)
  if (allPaths.length === 0) {
    return { ok: true, message: 'Folder is empty' }
  }
  const imageNames = allPaths.map((path) => path.fullPath)
  const { error } = await supabase.storage
    .from('user-images')
    .remove(imageNames)
  if (error) {
    return { ok: false, message: error.message }
  }

  revalidatePath('/studio/[collection]/layers', 'page')
  return { ok: true, message: 'Successfully deleted' }
}

export async function moveImage(oldPath: string, newPath: string) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.storage
    .from('user-images')
    .move(oldPath, newPath)
  if (data) revalidatePath('/studio/[collection]/layers', 'page')
  if (error) {
    throw new FetchError(error.message)
  }
  return data
}

export type MoveImage = {
  oldPath: string
  newPath: string
}

export async function moveImages(images: MoveImage[]) {
  const supabase = await createSupabaseClient()
  const results: string[] = []
  const errors: string[] = []
  for (const image of images) {
    const { data, error } = await supabase.storage
      .from('user-images')
      .move(image.oldPath, image.newPath)

    if (error) {
      errors.push(error?.message)
    } else {
      results.push(data.message)
    }
  }
  if (results.length > 0) revalidatePath('/studio/[collection]/layers', 'page')
  if (errors.length > 0) {
    throw new FetchError(errors[0] || 'Error moving images')
  }
  return results
}

export async function moveFolder(path: string, newPath: string) {
  const allChildren = await getAllUserImages(path)

  const images = allChildren.map((image) => {
    const newImagePath = image.fullPath.replace(path, newPath)
    return {
      oldPath: image.fullPath,
      newPath: newImagePath,
    }
  })

  const results = await moveImages(images)
  if (results.length > 0) revalidatePath('/studio/[collection]/layers', 'page')
  return results
}
