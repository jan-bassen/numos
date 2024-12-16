import { z } from 'zod'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema'
import { validateDefaultFormat } from '../refinements.js'

export const bufferSchema = z.instanceof(Buffer)

export const fullBufferSchema = z
  .object({
    type: z.literal('buffer'),
    list: z.boolean(),
    default: valueSchemas('buffer', bufferSchema).optional(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
