import type { Collection, UpdateCollection } from '@/types/database.types'
import { updateCollectionSchema } from '@/lib/schemas/collections/collection-schema'
import { createSafeUpdate } from '@/lib/data/create-safe-update'
import { patch } from '@/lib/data/store'

export async function updateCollectionBase(
  id: string,
  values: UpdateCollection,
) {
  const updated = await patch<Collection>('collections', id, values)
  if (!updated) {
    return { ok: false, message: 'Collection not found' }
  }
  return { ok: true, message: 'Collection updated' }
}

export const updateCollection = createSafeUpdate<UpdateCollection>(
  updateCollectionBase,
  updateCollectionSchema,
)
