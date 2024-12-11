import { z } from 'zod'
import { valueSchemas } from '@repo/engine/datatypes/schemas/value-schema.js'
import {
  validateDefaultFormat,
  validateDefaultValue,
} from '@repo/engine/datatypes/schemas/refinements.js'
import { isArray } from 'lodash'
import type {
  ObjectValue,
  RawSingleValue,
  ValueFormat,
  ValueTypeLiteral,
} from '@repo/engine/types/value-types.js'

export const numberSchema = z.number({
  required_error: 'Value is required',
  invalid_type_error: 'Must be a number',
})
export const integerSchema = numberSchema.int('Must be a whole number')

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
    restrictions: numberRestrictionsSchema,
  })
  .refine((schema) => {
    return validateDefaultFormat<typeof schema>(schema)
  }, 'Default value has wrong format')
  .refine((schema) => {
    validateDefaultValue<'number', typeof schema>(schema, (value) => {
      let valid = true
      if (schema.restrictions?.min) {
        valid = valid && value >= schema.restrictions.min
      }
      if (schema.restrictions?.max) {
        valid = valid && value <= schema.restrictions.max
      }
      return valid
    })
  })
