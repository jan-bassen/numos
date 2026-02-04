'use server'

import 'server-only'

import type { UpdateVersion } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { createSafeUpdate } from '@/lib/supabase/db/create-safe-update'
import { updateVersionSchema } from '@/lib/schemas/versions/version-schema'

export async function updateVersionBase(id: string, values: UpdateVersion) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('versions').update(values).eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }
  return { ok: true, message: 'Version updated' }
}

export const updateVersion = createSafeUpdate<UpdateVersion>(
  updateVersionBase,
  updateVersionSchema,
)
