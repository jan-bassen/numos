import { z } from 'zod'
import { stringSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/string-schema'
import { valueSchemas } from '@repo/shared/schemas/datatypes/value-schema'
import { validateDefaultFormat } from '@repo/shared/schemas/datatypes/refinements'

export const imageSchema = stringSchema

export const fullImageSchema = z
  .object({
    type: z.literal('image'),
    list: z.boolean(),
    default: valueSchemas('image', imageSchema).optional(),
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
