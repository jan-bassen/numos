import { z } from 'zod'
import { integerSchema } from '@repo/engine/datatypes/schemas/datatype-schemas/number-schema.js'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema.js'
import { validateDefaultFormat } from '../refinements.js'

export const datetimeSchema = integerSchema.min(0, 'Must be positive')

export const fullDatetimeSchema = z
  .object({
    type: z.literal('datetime'),
    list: z.boolean(),
    default: valueSchemas('datetime', datetimeSchema).optional(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
