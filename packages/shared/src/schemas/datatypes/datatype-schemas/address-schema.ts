import { z } from 'zod'
import { stringSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/string-schema'
import { valueSchemas } from '../value-schema'
import { validateDefaultFormat } from '../refinements'

export const addressSchema = stringSchema.regex(
  /^(0x)?[0-9a-fA-F]{40}$|^$/,
  'Must be a valid address',
)

export const fullAddressSchema = z
  .object({
    type: z.literal('address'),
    list: z.boolean(),
    /* default: valueSchemas('address', addressSchema).optional(), */
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
