'use server'

import 'server-only'

import type { UpdateCollection } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { createSafeUpdate } from '@/lib/supabase/db/create-safe-update'
import { updateCollectionSchema } from '@/lib/schemas/collections/collection-schema'

export async function updateCollectionBase(
  id: string,
  values: UpdateCollection,
) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('collections')
    .update(values)
    .eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }
  return { ok: true, message: 'Collection updated' }
}

export const updateCollection = createSafeUpdate<UpdateCollection>(
  updateCollectionBase,
  updateCollectionSchema,
)
