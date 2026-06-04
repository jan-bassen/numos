'use client'

import type { Result } from '@repo/shared/types/result'
import { putBlob, removeBlob } from './store'

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

/**
 * Client-side replacement for the former Supabase storage upload. Stores the raw
 * file blob keyed by the location's `name` (a uuid); `SupabaseImage` resolves that
 * key back to an object URL for display.
 */
export const uploadFile = async (
  location: StorageLocation,
  file: File,
  replacing?: StorageLocation,
  _options?: unknown,
): Promise<Result<StorageLocation>> => {
  if (!location.name) {
    return { error: 'Invalid location' }
  }

  await putBlob(location.name, file)

  if (replacing?.name && replacing.name !== location.name) {
    await removeBlob(replacing.name)
  }

  return { result: location }
}
