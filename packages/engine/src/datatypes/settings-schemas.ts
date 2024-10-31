import { type ZodType, z } from 'zod'
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
  NumberSettings,
  StringSettings,
  Value,
  ValueFormat,
  ValueSettings,
  ValueType,
} from '@repo/engine/types/value-types'

export function getBaseValueSchema(
  baseSchema: ZodType,
  format: ValueFormat,
): ZodType {
  switch (format) {
    case 'single':
      return baseSchema.nullable().optional()
    case 'array':
      return z.array(baseSchema.nullable().optional())
    case 'objectarray':
      return z.array(
        z.object({
          id: z.string().optional(),
          value: baseSchema.nullable().optional(),
        }),
      )
    default:
      throw new Error('Invalid format')
  }
}

export const getEnumSettingsSchema = (format: ValueFormat): ZodType => {
  const defaultValue = getBaseValueSchema(enumSchema, format)
  return z.object({
    default: defaultValue,
    options: z
      .array(
        z.object({
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
      }, 'Options must be unique'),
  })
}

export const getNumberSettingsSchema = (format: ValueFormat): ZodType => {
  const defaultValue = getBaseValueSchema(numberSchema, format)
  return z.object({
    default: defaultValue,
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
    step: z.preprocess((value) => {
      if (typeof value === 'string' && value === '') {
        return undefined
      }
      return value
    }, numberSchema.min(0, 'Must be positive').optional()),
  })
}

export const getStringSettingsSchema = (format: ValueFormat): ZodType => {
  const defaultValue = getBaseValueSchema(stringSchema, format)
  return z.object({
    default: defaultValue,
    min_length: z.preprocess((value) => {
      if (typeof value === 'string' && value === '') {
        return undefined
      }
      return value
    }, z.coerce.number().int().positive().optional()),
    max_length: z.preprocess((value) => {
      if (typeof value === 'string' && value === '') {
        return undefined
      }
      return value
    }, integerSchema.positive('Must be positive').optional()),
  })
}

export const getSettingsSchema = (
  type: ValueType,
  format: ValueFormat,
): ZodType => {
  switch (type) {
    case 'enum':
      return getEnumSettingsSchema(format)
    case 'number':
      return getNumberSettingsSchema(format)
    case 'string':
      return getStringSettingsSchema(format)
    case 'boolean':
      return getBaseValueSchema(booleanSchema, format)
    case 'color':
      return getBaseValueSchema(colorSchema, format)
    case 'location':
      return getBaseValueSchema(locationSchema, format)
    case 'datetime':
      return getBaseValueSchema(datetimeSchema, format)
    case 'direction':
      return getBaseValueSchema(directionSchema, format)
    case 'weather':
      return getBaseValueSchema(weatherSchema, format)
    case 'address':
      return getBaseValueSchema(addressSchema, format)
    case 'image':
      return getBaseValueSchema(stringSchema, format)
    case 'buffer':
      return getBaseValueSchema(bufferSchema, format)
    default:
      return z.never()
  }
}

export function getNumberSettingsValidation(settings: NumberSettings) {
  let schema = numberSchema
  if (settings?.min)
    schema = schema.gte(settings.min, {
      message: `Must be greater than or equal to ${settings.min}`,
    })
  if (settings?.max)
    schema = schema.lte(settings.max, {
      message: `Must be less than or equal to ${settings.max}`,
    })
  if (settings?.step)
    schema = schema.step(settings.step, {
      message: `Must be a multiple of ${settings.step}`,
    })
  return schema
}

export function getStringSettingsValidation(settings: StringSettings) {
  let schema = stringSchema
  if (settings?.min_length)
    schema = schema.min(settings.min_length, {
      message: `Must be at least ${settings.min_length} characters`,
    })
  if (settings?.max_length)
    schema = schema.max(settings.max_length, {
      message: `Must be at most ${settings.max_length} characters`,
    })
  return schema
}

export function getEnumSettingsValidation(settings: EnumSettings) {
  const options = settings?.options?.map((option) => {
    return option.value
  })
  return z.string().refine((data) => {
    if (options?.includes(data)) {
      return data
    }
    return { message: 'Invalid option' }
  })
}

export function getBaseSettingsValidation(
  baseSchema: ZodType,
  settings: BaseSettings,
) {
  return baseSchema
}

export function getSettingsValidation(
  type: ValueType,
  format: ValueFormat,
  optional: boolean,
  settings: ValueSettings,
): ZodType {
  let schema: ZodType
  switch (type) {
    case 'enum':
      schema = getEnumSettingsValidation(settings as EnumSettings)
      break
    case 'number':
      schema = getNumberSettingsValidation(settings as NumberSettings)
      break
    case 'string':
      schema = getStringSettingsValidation(settings as StringSettings)
      break
    case 'boolean':
      schema = getBaseSettingsValidation(
        booleanSchema,
        settings as BaseSettings,
      )
      break
    case 'color':
      schema = getBaseSettingsValidation(colorSchema, settings as BaseSettings)
      break
    case 'location':
      schema = getBaseSettingsValidation(
        locationSchema,
        settings as BaseSettings,
      )
      break
    case 'direction':
      schema = getBaseSettingsValidation(
        directionSchema,
        settings as BaseSettings,
      )
      break
    case 'weather':
      schema = getBaseSettingsValidation(
        weatherSchema,
        settings as BaseSettings,
      )
      break
    case 'address':
      schema = getBaseSettingsValidation(
        addressSchema,
        settings as BaseSettings,
      )
      break
    case 'datetime':
      schema = getBaseSettingsValidation(
        datetimeSchema,
        settings as BaseSettings,
      )
      break
    case 'image':
      schema = getStringSettingsValidation(settings as StringSettings)
      break
    case 'buffer':
      schema = getBaseSettingsValidation(bufferSchema, settings as BaseSettings)
      break
    default:
      throw new Error('Invalid type')
  }
  if (optional) schema = schema.nullable().optional()
  if (format === 'array') {
    schema = z.array(schema)
  }
  if (format === 'objectarray') {
    schema = z.array(
      z.object({
        id: z.string().optional(),
        value: schema,
      }),
    )
  }
  return schema
}
