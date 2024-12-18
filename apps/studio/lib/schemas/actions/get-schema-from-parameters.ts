import type { ParameterInfo } from '@/types/actions.types'
import type { SchemaMap } from '@/types/database.types'
import { getRestrictionsValidation } from '@repo/engine/datatypes/settings-schemas'
import { z } from 'zod'

export function getSchemaFromParameters(
  parameters: ParameterInfo[],
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
