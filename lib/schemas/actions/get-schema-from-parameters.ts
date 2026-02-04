import type { SchemaMap } from '@/types/database.types'
import { getRestrictionsValidation } from '@repo/shared/schemas/datatypes/restrictions'
import { z } from 'zod'
import type { Parameter } from '@/lib/schemas/actions/triggers/api'

export function getSchemaFromParameters(
  parameters: Parameter[],
  optional: boolean,
) {
  const schema: SchemaMap = {}
  for (const parameter of parameters) {
    const singleSchema = getRestrictionsValidation(parameter.value, {
      optional,
      format: parameter.value.list ? 'objectarray' : 'single',
    })
    if (optional) schema[parameter.key] = singleSchema.nullable().optional()
    else schema[parameter.key] = singleSchema
  }
  return z.object(schema).optional()
}
