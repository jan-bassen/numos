import { z } from 'zod'
import { integerSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/number-schema'
import { valueSchemas } from '@repo/shared/schemas/datatypes/value-schema'
import { validateDefaultFormat } from '@repo/shared/schemas/datatypes/refinements'

export const datetimeSchema = integerSchema.min(0, 'Must be positive')

export const fullDatetimeSchema = z
  .object({
    type: z.literal('datetime'),
    list: z.boolean(),
    default: valueSchemas('datetime', datetimeSchema).optional(),
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
