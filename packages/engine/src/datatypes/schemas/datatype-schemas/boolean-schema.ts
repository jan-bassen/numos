import { z } from 'zod'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema.js'
import { validateDefaultFormat } from '../refinements.js'

export const booleanSchema = z.boolean({
  required_error: 'Value is required',
  invalid_type_error: 'Must be true or false',
})

export const fullBooleanSchema = z
  .object({
    type: z.literal('boolean'),
    list: z.boolean(),
    default: valueSchemas('boolean', booleanSchema).optional(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
