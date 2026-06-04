import type { Attribute, UpdateAttribute } from '@/types/database.types'
import { updateAttributeSlugInNodes } from '@/lib/data/attributes/nodes/update'
import { updateAttributeSchema } from '@/lib/schemas/attributes/attribute-schema'
import { createSafeUpdate } from '@/lib/data/create-safe-update'
import { patch } from '@/lib/data/store'

export async function updateAttributeBase(id: string, values: UpdateAttribute) {
  if (values.slug) {
    if (typeof values.slug !== 'string' || values.slug.length === 0) {
      return { ok: false, message: 'Slug cannot be empty' }
    }
    const res = await updateAttributeSlugInNodes(id, values.slug)
    if (!res.ok) {
      return res
    }
  }

  const updated = await patch<Attribute>('attributes', id, values)
  if (!updated) {
    return { ok: false, message: 'Attribute not found' }
  }
  return { ok: true, message: 'Attribute updated' }
}

export const updateAttribute = createSafeUpdate<UpdateAttribute>(
  updateAttributeBase,
  updateAttributeSchema,
)
