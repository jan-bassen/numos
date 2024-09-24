import { directionKeys } from '@/lib/supabase/constants/directions'
import { weatherCodes } from '@/lib/supabase/constants/weather'
import type {
  DataType,
  DatatypeObjectValue,
  DataTypeValue,
  NotatedDataTypeValue,
  ValueDataType,
} from '@/types/database.types'
import { id } from 'date-fns/locale'
import { isArray } from 'lodash'
import { ZodError, type ZodType, number, z } from 'zod'

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

export const directionSchema = z.enum(directionKeys, {
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

export const datatypeSchema: Record<DataType, z.ZodType> = {
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
  exec: z.never(),
  generic: z.never(),
}

export function getDataTypeSchema(
  type: ValueDataType,
  list: boolean,
  options?: { optional?: boolean; asObjectArray?: boolean },
): ZodType {
  const baseSchema = options?.optional
    ? datatypeSchema[type].optional().nullable()
    : datatypeSchema[type]

  if (list) {
    return options?.asObjectArray
      ? z.array(
          z.object({
            id: z.string().optional(),
            value: baseSchema,
          }),
        )
      : z.array(baseSchema)
  }
  return baseSchema
}

export function validateValueType<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
>(
  type: ValueDataType,
  list: boolean,
  value: AsObjectArray extends true
    ? DatatypeObjectValue<DataTypeValue, Optional>[] | DataTypeValue<Optional>
    : DataTypeValue<Optional>[] | DataTypeValue<Optional>,
  options?: { optional?: Optional; asObjectArray?: AsObjectArray },
):
  | {
      result: undefined
      error: ZodError
    }
  | {
      result: NotatedDataTypeValue<Optional, AsObjectArray>
      error: undefined
    } {
  if ((value === undefined || value === null) && options?.optional) {
    return {
      result: {
        type: type,
        list: list,
        value: undefined,
      } as NotatedDataTypeValue<Optional, AsObjectArray>,
      error: undefined,
    }
  }

  if (!type) throw new Error('No type defined')
  const schema = getDataTypeSchema(type, list, options)
  if (!schema) throw new Error('No schema defined')
  try {
    const newValue = schema.parse(value)
    return {
      result: { type: type, list, value: newValue } as NotatedDataTypeValue<
        Optional,
        AsObjectArray
      >,
      error: undefined,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error, result: undefined }
    }
    throw new Error('Unexpected error with parsing value')
  }
}

export function isValidValueType<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
>(
  type: ValueDataType,
  list: boolean,
  value?:
    | DataTypeValue<Optional>
    | DatatypeObjectValue<DataTypeValue, Optional>[]
    | DataTypeValue<Optional>[],
  options?: { optional?: Optional; asObjectArray?: AsObjectArray },
): boolean {
  if (!value && options?.optional) return true
  if (!type) throw new Error('No type defined')
  const schema = getDataTypeSchema(type, list, options)
  if (!schema) throw new Error('No schema defined')
  try {
    return schema.safeParse(value).success
  } catch (error) {
    console.log(error)
    return false
  }
}
