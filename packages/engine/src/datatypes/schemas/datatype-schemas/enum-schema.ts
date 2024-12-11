import { z } from 'zod'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema.js'
import {
  validateDefaultFormat,
  validateDefaultValue,
} from '@repo/engine/datatypes/schemas/refinements.js'

export const enumSchema = z.string({
  required_error: 'Value is required',
  invalid_type_error: 'Must be a text value',
})

const enumOptionsSchema = z
  .array(
    z.object({
      id: z.string().optional(),
      value: z
        .string({
          required_error: "Options can't be empty",
          invalid_type_error: "Options can't be empty",
        })
        .min(1, "Options can't be empty")
        .max(50, "Options can't be longer than 50 characters"),
    }),
  )
  .min(1, 'At least one option is required')
  .refine((arr) => {
    const options = arr.map((option) => option.value)
    const unique = new Set(options)
    return unique.size === options.length
  }, 'Options must be unique')

export const fullEnumSchema = z
  .object({
    type: z.literal('enum'),
    list: z.boolean(),
    default: valueSchemas('enum', enumSchema).optional(),
    restrictions: z.object({ options: enumOptionsSchema }),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
  .refine((schema) => {
    return validateDefaultValue<'enum', typeof schema>(schema, (value) => {
      return schema.restrictions.options.some((opt) => opt.value === value)
    })
  }, 'Default value needs to be one of the options')
