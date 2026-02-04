'use server'

import 'server-only'

import type { UpdateAction } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { updateActionSchema } from '@/lib/schemas/actions/action-schema'
import { createSafeUpdate } from '@/lib/supabase/db/create-safe-update'

export async function updateActionBase(id: string, values: UpdateAction) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('actions').update(values).eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }
  return { ok: true, message: 'Action updated' }
}

export const updateAction = createSafeUpdate<UpdateAction>(
  updateActionBase,
  updateActionSchema,
)
