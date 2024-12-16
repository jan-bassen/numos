import { type ZodType, optional, z } from 'zod'
import {
  addressSchema,
  booleanSchema,
  bufferSchema,
  colorSchema,
  datetimeSchema,
  directionSchema,
  enumSchema,
  integerSchema,
  locationSchema,
  numberSchema,
  stringSchema,
  weatherSchema,
} from '@repo/engine/datatypes/schemas'
import type {
  BaseSettings,
  EnumSettings,
  FullValue,
  NumberSettings,
  StringSettings,
  Value,
  ValueFormat,
  ValueRestrictions,
  ValueSettings,
  ValueType,
} from '@repo/engine/types/value-types'

export function getNumberRestrictionsValidation(
  restrictions: ValueRestrictions<'number'>,
) {
  let schema = numberSchema
  if (restrictions?.min)
    schema = schema.gte(restrictions.min, {
      message: `Must be greater than or equal to ${restrictions.min}`,
    })
  if (restrictions?.max)
    schema = schema.lte(restrictions.max, {
      message: `Must be less than or equal to ${restrictions.max}`,
    })
  return schema
}

export function getStringRestrictionsValidation(
  restrictions: ValueRestrictions<'string'>,
) {
  let schema = stringSchema
  if (restrictions?.min_length)
    schema = schema.min(restrictions.min_length, {
      message: `Must be at least ${restrictions.min_length} characters`,
    })
  if (restrictions?.max_length)
    schema = schema.max(restrictions.max_length, {
      message: `Must be at most ${restrictions.max_length} characters`,
    })
  return schema
}

export function getEnumRestrictionsValidation(
  restrictions: ValueRestrictions<'enum'>,
) {
  const options = restrictions?.options?.map((option) => {
    return option.value
  })
  return z.string().refine((data) => {
    if (options?.includes(data)) {
      return data
    }
    return { message: 'Invalid option' }
  })
}

export function getBaseRestrictionsValidation<VT extends ValueType>(
  baseSchema: ZodType,
  restrictions: ValueRestrictions<VT>,
) {
  return baseSchema
}

export function getRestrictionsValidation(
  value: FullValue,
  settings: {
    optional: boolean
    format: ValueFormat
  },
): ZodType {
  let schema: ZodType
  switch (value.type) {
    case 'enum':
      schema = getEnumRestrictionsValidation(
        value.restrictions as ValueRestrictions<'enum'>,
      )
      break
    case 'number':
      schema = getNumberRestrictionsValidation(
        value.restrictions as ValueRestrictions<'number'>,
      )
      break
    case 'string':
      schema = getStringRestrictionsValidation(
        value.restrictions as ValueRestrictions<'string'>,
      )
      break
    case 'boolean':
      schema = getBaseRestrictionsValidation(
        booleanSchema,
        value.restrictions as ValueRestrictions<'boolean'>,
      )
      break
    case 'color':
      schema = getBaseRestrictionsValidation(
        colorSchema,
        value.restrictions as ValueRestrictions<'color'>,
      )
      break
    case 'location':
      schema = getBaseRestrictionsValidation(
        locationSchema,
        value.restrictions as ValueRestrictions<'location'>,
      )
      break
    case 'direction':
      schema = getBaseRestrictionsValidation(
        directionSchema,
        value.restrictions as ValueRestrictions<'direction'>,
      )
      break
    case 'weather':
      schema = getBaseRestrictionsValidation(
        weatherSchema,
        value.restrictions as ValueRestrictions<'weather'>,
      )
      break
    case 'address':
      schema = getBaseRestrictionsValidation(
        addressSchema,
        value.restrictions as ValueRestrictions<'address'>,
      )
      break
    case 'datetime':
      schema = getBaseRestrictionsValidation(
        datetimeSchema,
        value.restrictions as ValueRestrictions<'datetime'>,
      )
      break
    case 'image':
      schema = getBaseRestrictionsValidation(
        stringSchema,
        value.restrictions as ValueRestrictions<'image'>,
      )
      break
    case 'buffer':
      schema = getBaseRestrictionsValidation(
        bufferSchema,
        value.restrictions as ValueRestrictions<'buffer'>,
      )
      break
    default:
      throw new Error('Invalid type')
  }
  if (settings.optional) schema = schema.nullable().optional()
  if (settings.format === 'array') {
    schema = z.array(schema)
  }
  if (settings.format === 'objectarray') {
    schema = z.array(
      z.object({
        id: z.string().optional(),
        value: schema,
      }),
    )
  }
  return schema
}
