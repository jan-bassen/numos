'use client'

import { createSupabaseClient } from '@/lib/supabase/clients/client'
import type { FileOptions } from '@supabase/storage-js'
import type { Result } from '@repo/shared/types/result'

export type StorageLocation = {
  bucket: string
  path?: string
  name: string | null
}

export const locationToPath = (location: StorageLocation) => {
  if (location.name === null) {
    return null
  }
  if (location.path) {
    return `${location.path}${location.name}`
  }
  return location.name
}

export const locationToFullPath = (location: StorageLocation) => {
  if (location.name === null) {
    return null
  }
  if (location.path) {
    return `${location.bucket}/${location.path}${location.name}`
  }
  return `${location.bucket}/${location.name}`
}

export const uploadFile = async (
  location: StorageLocation,
  file: File,
  replacing?: StorageLocation,
  options?: {
    keepExtension?: boolean
  } & FileOptions,
): Promise<Result<StorageLocation>> => {
  const cleanedName = location.name?.split('.')[0]
  const newName = options?.keepExtension
    ? location.name
    : cleanedName || location.name
  const fullPath = location.path ? location.path + newName : newName

  if (!fullPath) {
    return {
      error: 'Invalid location',
    }
  }

  const supabase = await createSupabaseClient()
  const { data, error: uploadError } = await supabase.storage
    .from(location.bucket)
    .upload(fullPath, file, {
      upsert: true,
      cacheControl: '0',
    })

  if (uploadError) {
    return {
      error: `Error uploading image: ${uploadError.message}`,
    }
  }

  if (replacing) {
    const path = locationToPath(replacing)
    if (!path) {
      return {
        error: 'Invalid location for replacing image',
      }
    }
    const { data, error: removeError } = await supabase.storage
      .from(replacing.bucket)
      .remove([path])
    if (removeError) {
      return {
        error: `Error removing old image: ${removeError.message}`,
      }
    }
  }

  return {
    result: location,
  }
}
