import { z } from 'zod'
import { directions } from '@repo/engine/datatypes/constants/directions'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema.js'
import { validateDefaultFormat } from '../refinements.js'

export const directionSchema = z.enum(directions, {
  invalid_type_error: 'Must be a valid direction',
  required_error: 'Value is required',
})

export const fullDirectionSchema = z
  .object({
    type: z.literal('direction'),
    list: z.boolean(),
    default: valueSchemas('direction', directionSchema).optional(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
