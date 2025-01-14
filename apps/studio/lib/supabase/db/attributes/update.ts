'use server'

import 'server-only'

import type { UpdateAttribute } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { updateAttributeSlugInNodes } from '@/lib/supabase/db/attributes/nodes/update'
import { updateAttributeSchema } from '@/lib/schemas/attributes/attribute-schema'
import { createSafeUpdate } from '@/lib/supabase/db/create-safe-update'

export async function updateAttributeBase(id: string, values: UpdateAttribute) {
  if (values.slug) {
    if (typeof values.slug !== 'string' || values.slug.length === 0) {
      return { ok: false, message: 'Slug cannot be empty' }
    }
    const res = await updateAttributeSlugInNodes(id, values.slug)
    if (!res.ok) {
      console.log(res)
      return res
    }
  }

  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('attributes')
    .update(values)
    .eq('id', id)
  if (error) {
    console.log(error)
    return { ok: false, message: error.message }
  }
  console.log('Attribute updated')
  return { ok: true, message: 'Attribute updated' }
}

export const updateAttribute = createSafeUpdate<UpdateAttribute>(
  updateAttributeBase,
  updateAttributeSchema,
)
