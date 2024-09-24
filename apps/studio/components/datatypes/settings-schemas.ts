import { type ZodType, z } from 'zod'
import type {
  ValueSettings,
  BaseSettings,
  DataType,
  EnumSettings,
  NumberSettings,
  StringSettings,
} from '../../types/database.types'
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
} from './schemas'

export const getEnumSettingsSchema = (list: boolean): ZodType => {
  const defaultValue = list
    ? z.array(z.object({ value: enumSchema }))
    : enumSchema.nullable().optional()
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

export const getNumberSettingsSchema = (list: boolean): ZodType => {
  const defaultValue = list
    ? z.array(numberSchema)
    : numberSchema.nullable().optional()
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

export const getStringSettingsSchema = (list: boolean): ZodType => {
  const defaultValue = list
    ? z.array(z.object({ value: stringSchema }))
    : stringSchema.nullable().optional()
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

export function getBaseSettingsSchema(
  baseSchema: ZodType,
  list: boolean,
): ZodType {
  const defaultValue = list
    ? z.array(z.object({ value: baseSchema }))
    : baseSchema.nullable().optional()
  return z.object({
    default: defaultValue,
  })
}

export const getSettingsSchema = (type: DataType, list: boolean): ZodType => {
  switch (type) {
    case 'enum':
      return getEnumSettingsSchema(list)
    case 'number':
      return getNumberSettingsSchema(list)
    case 'string':
      return getStringSettingsSchema(list)
    case 'boolean':
      return getBaseSettingsSchema(booleanSchema, list)
    case 'color':
      return getBaseSettingsSchema(colorSchema, list)
    case 'location':
      return getBaseSettingsSchema(locationSchema, list)
    case 'datetime':
      return getBaseSettingsSchema(datetimeSchema, list)
    case 'direction':
      return getBaseSettingsSchema(directionSchema, list)
    case 'weather':
      return getBaseSettingsSchema(weatherSchema, list)
    case 'address':
      return getBaseSettingsSchema(addressSchema, list)
    case 'image':
      return getBaseSettingsSchema(stringSchema, list)
    case 'buffer':
      return getBaseSettingsSchema(bufferSchema, list)
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
  const options = settings?.options.map((option) => {
    return option.value
  })
  return z.string().refine((data) => {
    if (options.includes(data)) {
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
  type: DataType,
  list: boolean,
  settings: ValueSettings,
  options?: { optional?: boolean; asObjectArray?: boolean },
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
  if (options?.optional) schema = schema.nullable().optional()
  if (list)
    schema = options?.asObjectArray
      ? z.array(z.object({ value: schema }))
      : z.array(schema)
  return schema
}
