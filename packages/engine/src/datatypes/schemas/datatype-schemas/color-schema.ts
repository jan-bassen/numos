import { z } from 'zod'
import { integerSchema, numberSchema } from '@repo/engine/datatypes/schemas'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema.js'
import { validateDefaultFormat } from '../refinements.js'

const colorChannelSchema = integerSchema
  .min(0, 'Must be positive')
  .max(255, 'Must be less than 255')

export const colorSchema = z.object({
  r: colorChannelSchema,
  g: colorChannelSchema,
  b: colorChannelSchema,
  a: numberSchema
    .min(0, 'Must be positive')
    .max(1, "Can't be greater than 100%")
    .default(1),
})

export const fullColorSchema = z
  .object({
    type: z.literal('color'),
    list: z.boolean(),
    default: valueSchemas('color', colorSchema).optional(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
