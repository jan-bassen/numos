import { z } from 'zod'
import { valueSchemas } from '@repo/shared/schemas/datatypes/value-schema'
import {
  validateDefaultFormat,
  validateDefaultValue,
} from '@repo/shared/schemas/datatypes/refinements'

export const numberSchema = z.coerce.number({
  required_error: 'Value is required',
  invalid_type_error: 'Must be a number',
})

/* export const newNumberSchema = z
  .string()
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .refine((value) => value === null || !Number.isNaN(Number(value)), {
    message: 'Invalid number',
  })
  .transform((value) => (value === null ? null : Number(value))) */

export const integerSchema = numberSchema.int('Must be a whole number')

export type NumberRestrictions = z.infer<typeof numberRestrictionsSchema>
export const numberRestrictionsSchema = z.object({
  min: z.preprocess((value) => {
    if (typeof value === 'string' && value === '') {
      return undefined
    }
    return value
  }, numberSchema.optional()),
  max: z.preprocess((value) => {
    if (typeof value === 'string' && value === '') {
      return undefined
    }
    return value
  }, numberSchema.optional()),
})

export const fullNumberSchema = z
  .object({
    type: z.literal('number'),
    list: z.boolean(),
    default: valueSchemas('number', numberSchema).optional(),
    optional: z.boolean().default(false),
    restrictions: numberRestrictionsSchema.optional(),
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
  .refine((schema) => {
    return validateDefaultValue<'number', typeof schema>(schema, (value) => {
      let valid = true
      if (schema.restrictions?.min) {
        valid = valid && value >= schema.restrictions.min
      }
      if (schema.restrictions?.max) {
        valid = valid && value <= schema.restrictions.max
      }
      return valid
    })
  }, 'Default value does not match the restrictions')
