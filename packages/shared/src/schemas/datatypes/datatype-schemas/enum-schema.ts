import { z } from 'zod'
import { valueSchemas } from '@repo/shared/schemas/datatypes/value-schema'
import {
  validateDefaultFormat,
  validateDefaultValue,
} from '@repo/shared/schemas/datatypes/refinements'

export const enumSchema = z.string({
  required_error: 'Value is required',
  invalid_type_error: 'Must be a text value',
})

const enumOptionsSchema = z
  .array(
    z.object({
      id: z.string().optional(),
      label: z.string().optional(),
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

export type EnumRestrictions = z.infer<typeof enumRestrictionsSchema>
export const enumRestrictionsSchema = z.object({
  options: enumOptionsSchema,
  adaptOptions: z.boolean().optional(),
})

export const fullEnumSchema = z
  .object({
    type: z.literal('enum'),
    list: z.boolean(),
    default: valueSchemas('enum', enumSchema).optional(),
    optional: z.boolean().default(false),
    restrictions: enumRestrictionsSchema.optional().nullable(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
  .refine((schema) => {
    return validateDefaultValue<'enum', typeof schema>(schema, (value) => {
      if (schema.restrictions) {
        const r = schema.restrictions
        return r.options.some((opt) => opt.value === value)
      }
      return true
    })
  }, 'Default value needs to be one of the options')
