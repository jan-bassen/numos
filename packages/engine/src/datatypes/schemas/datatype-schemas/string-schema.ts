import { z } from 'zod'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema.js'
import { integerSchema } from '@repo/engine/datatypes/schemas/datatype-schemas/number-schema.js'
import { validateDefaultFormat } from '../refinements.js'

export const stringSchema = z.string({
  required_error: 'Value is required',
  invalid_type_error: 'Must be a text value',
})

export type StringRestrictions = z.infer<typeof stringRestrictionsSchema>
const stringRestrictionsSchema = z.object({
  min_length: z.preprocess((value) => {
    if (typeof value === 'string' && value === '') {
      return undefined
    }
    return value
  }, integerSchema.positive('Must be positive').optional()),
  max_length: z.preprocess((value) => {
    if (typeof value === 'string' && value === '') {
      return undefined
    }
    return value
  }, integerSchema.positive('Must be positive').optional()),
})

export const fullStringSchema = z
  .object({
    type: z.literal('string'),
    list: z.boolean(),
    default: valueSchemas('string', stringSchema).optional(),
    restrictions: stringRestrictionsSchema,
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
