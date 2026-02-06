import { z } from 'zod'
import { valueSchemas } from '../value-schema'
import { validateDefaultFormat } from '../refinements'

export const booleanSchema = z.boolean({
  error: (issue) => issue.input === undefined ? 'Value is required' : 'Must be true or false',
})

export const fullBooleanSchema = z
  .object({
    type: z.literal('boolean'),
    list: z.boolean(),
    /* default: valueSchemas('boolean', booleanSchema).optional(), */
    optional: z.boolean().default(false),
    restrictions: z.object({}).optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
