import { z } from 'zod'
import { directions } from '@repo/shared/constants/directions'
import { valueSchemas } from '../value-schema'
import { validateDefaultFormat } from '../refinements'

export const directionSchema = z.enum(directions, {
  invalid_type_error: 'Must be a valid direction',
  required_error: 'Value is required',
})

export const fullDirectionSchema = z
  .object({
    type: z.literal('direction'),
    list: z.boolean(),
    /* default: valueSchemas('direction', directionSchema).optional(), */
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
