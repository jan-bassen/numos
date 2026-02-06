import { fullDatatypeSchema } from '@repo/shared/schemas/datatypes/datatype-schema'
import { z } from 'zod'

export type Parameter = z.infer<typeof parameterSchema>

const parameterSchema = z.object({
  id: z.string().uuid(),
  key: z
    .string({
      error: 'Key must be a string',
    })
    .min(1, 'Every parameter needs a key')
    .regex(/^[a-zA-Z]/, {
      message: 'Parameter key must start with a letter (a-z or A-Z).',
    })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        'Parameter key can only contain letters, numbers, underscores, and hyphens.',
    }),
  value: fullDatatypeSchema,
})

export const apiTriggerSchema = z.object({
  type: z.literal('api'),
  settings: z.object({
    params: z.array(parameterSchema).refine((params) => {
      const keys = params.map((param) => param.key)
      return new Set(keys).size === keys.length
    }, 'Every parameter needs a unique key'),
  }),
})
