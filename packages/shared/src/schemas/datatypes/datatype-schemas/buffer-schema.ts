import { z } from 'zod'
import { valueSchemas } from '../value-schema'
import { validateDefaultFormat } from '../refinements'

export const bufferSchema = z.instanceof(Buffer)

export const fullBufferSchema = z
  .object({
    type: z.literal('buffer'),
    list: z.boolean(),
    /* default: valueSchemas('buffer', bufferSchema).optional(), */
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
