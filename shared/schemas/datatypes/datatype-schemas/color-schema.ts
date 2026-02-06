import { z } from 'zod'
import { valueSchemas } from '@repo/shared/schemas/datatypes/value-schema'
import { validateDefaultFormat } from '@repo/shared/schemas/datatypes/refinements'

const colorChannelSchema = z.coerce
  .number({
    error: (issue) => issue.input === undefined ? 'Value is required' : 'Must be a number',
  })
  .int('Must be an integer')
  .min(0, 'Must be positive')
  .max(255, 'Must be less than 255')

export const colorSchema = z.object({
  r: colorChannelSchema,
  g: colorChannelSchema,
  b: colorChannelSchema,
  a: z.coerce
    .number({
      error: (issue) => issue.input === undefined ? 'Value is required' : 'Must be a number',
    })
    .min(0, 'Must be positive')
    .max(1, "Can't be greater than 100%")
    .default(1),
})

export const fullColorSchema = z
  .object({
    type: z.literal('color'),
    list: z.boolean(),
    /*     default: valueSchemas('color', colorSchema).optional(), */
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
