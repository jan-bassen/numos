import { fullDatatypeSchema } from '@repo/engine/datatypes/schemas/datatype-schema'
import { z } from 'zod'

export const apiTriggerSchema = z.object({
  type: z.literal('api'),
  params: z
    .array(
      z.object({
        key: z
          .string({
            required_error: 'Every parameter needs a key',
            invalid_type_error: 'Key must be a string',
          })
          .min(1, 'Every parameter needs a key'),
        value: fullDatatypeSchema,
      }),
    )
    .refine((params) => {
      const keys = params.map((param) => param.key)
      return new Set(keys).size === keys.length
    }, 'Every parameter needs a unique key'),
})
