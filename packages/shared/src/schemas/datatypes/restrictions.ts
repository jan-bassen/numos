import { type ZodType, z } from 'zod'

import type { ValueFormat, ValueRestrictions } from '@repo/shared/types/values'
import type { FullValue } from '@repo/shared/schemas/datatypes/datatype-schema'
import { stringSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/string-schema'
import { numberSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/number-schema'
import { booleanSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/boolean-schema'
import { colorSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/color-schema'
import { locationSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/location-schema'
import { directionSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/direction-schema'
import { weatherSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/weather-schema'
import { addressSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/address-schema'
import { datetimeSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/datetime-schema'
import { bufferSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/buffer-schema'

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
      schema = booleanSchema
      break
    case 'color':
      schema = colorSchema
      break
    case 'location':
      schema = locationSchema
      break
    case 'direction':
      schema = directionSchema
      break
    case 'weather':
      schema = weatherSchema
      break
    case 'address':
      schema = addressSchema
      break
    case 'datetime':
      schema = datetimeSchema
      break
    case 'buffer':
      schema = bufferSchema
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
