import { z } from 'zod'
import { stringSchema } from '@repo/engine/datatypes/schemas'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema.js'
import { validateDefaultFormat } from '../refinements.js'

export const addressSchema = stringSchema.regex(
  /^(0x)?[0-9a-fA-F]{40}$|^$/,
  'Must be a valid address',
)

export const fullAddressSchema = z
  .object({
    type: z.literal('address'),
    list: z.boolean(),
    default: valueSchemas('address', addressSchema).optional(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
