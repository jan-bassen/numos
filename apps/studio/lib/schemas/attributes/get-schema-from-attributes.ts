import type { SchemaMap } from '@/types/database.types'
import type { Attribute } from '@/types/database.types'
import { getRestrictionsValidation } from '@repo/shared/schemas/datatypes/restrictions'
import { z } from 'zod'

export function getSchemaFromAttributes(
  attributes: Attribute[],
  optional: boolean,
) {
  const schema: SchemaMap = {}
  for (const attribute of attributes) {
    const singleSchema = getRestrictionsValidation(attribute.value, {
      optional,
      format: attribute.list ? 'objectarray' : 'single',
    })
    if (optional) schema[attribute.id] = singleSchema.nullable().optional()
    else schema[attribute.id] = singleSchema
  }
  return z.object(schema).optional()
}
