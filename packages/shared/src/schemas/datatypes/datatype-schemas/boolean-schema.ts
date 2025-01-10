import { z } from 'zod'
import { valueSchemas } from '@repo/shared/schemas/datatypes/value-schema'
import { validateDefaultFormat } from '@repo/shared/schemas/datatypes/refinements'

export const booleanSchema = z.boolean({
  required_error: 'Value is required',
  invalid_type_error: 'Must be true or false',
})

export const fullBooleanSchema = z
  .object({
    type: z.literal('boolean'),
    list: z.boolean(),
    default: valueSchemas('boolean', booleanSchema).optional(),
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
