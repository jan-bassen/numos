import { type ZodType, z } from 'zod'
import type { ValueFormat, ValueType } from '@repo/engine/types/value-types'
import { directions } from '@repo/engine/datatypes/directions'
import { weatherCodes } from '@repo/engine/datatypes/weather-codes'

export const enumSchema = z.string({
  required_error: 'Value is required',
  invalid_type_error: 'Must be a text value',
})

export const numberSchema = z.coerce.number({
  required_error: 'Value is required',
  invalid_type_error: 'Must be a number',
})

export const integerSchema = numberSchema.int('Must be a whole number')

export const stringSchema = z.string({
  required_error: 'Value is required',
  invalid_type_error: 'Must be a text value',
})

export const booleanSchema = z.boolean({
  required_error: 'Value is required',
  invalid_type_error: 'Must be true or false',
})

const colorChannelSchema = integerSchema
  .min(0, 'Must be positive')
  .max(255, 'Must be less than 255')

export const colorSchema = z.object({
  r: colorChannelSchema,
  g: colorChannelSchema,
  b: colorChannelSchema,
  a: numberSchema
    .min(0, 'Must be positive')
    .max(1, "Can't be greater than 100%")
    .default(1),
})

export const locationSchema = z.object({
  lat: numberSchema
    .min(-90, "Can't be less than -90")
    .max(90, "Can't be greater than 90"),
  lng: numberSchema
    .min(-180, "Can't be less than -180")
    .max(180, "Can't be greater than 180"),
})

export const datetimeSchema = integerSchema.min(0, 'Must be positive')

export const bufferSchema = z.instanceof(Buffer)

export const directionSchema = z.enum(directions, {
  invalid_type_error: 'Must be a valid direction',
  required_error: 'Value is required',
})

export const weatherSchema = z.enum(weatherCodes, {
  invalid_type_error: 'Must be a valid weather condition',
  required_error: 'Value is required',
})

export const addressSchema = stringSchema.regex(
  /^(0x)?[0-9a-fA-F]{40}$/,
  'Must be a valid address',
)

export const datatypeSchema: Record<ValueType, z.ZodType> = {
  number: numberSchema,
  string: stringSchema,
  boolean: booleanSchema,
  color: colorSchema,
  location: locationSchema,
  direction: directionSchema,
  weather: weatherSchema,
  address: addressSchema,
  image: stringSchema,
  datetime: datetimeSchema,
  buffer: bufferSchema,
  enum: enumSchema,
}

export function getDataTypeSchema(
  type: ValueType,
  format: ValueFormat,
  optional: boolean,
): ZodType {
  const baseSchema = optional
    ? datatypeSchema[type].optional().nullable()
    : datatypeSchema[type]

  if (format === 'array') {
    return z.array(baseSchema)
  }
  if (format === 'objectarray') {
    if (optional) {
      return z
        .array(
          z.object({
            id: z.string().optional(),
            value: baseSchema,
          }),
        )
        .optional()
        .nullable()
    }
    return z.array(
      z.object({
        id: z.string().optional(),
        value: baseSchema,
      }),
    )
  }
  return baseSchema
}
