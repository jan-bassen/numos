import { ZodError } from 'zod'
import type { Value, ValueFormat, ValueType } from '../types/value-types.ts'
import { getDataTypeSchema } from './schemas.ts'

export function validateValueType<
  T extends ValueType = ValueType,
  F extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
>(
  type: T,
  format: F,
  optional: Optional,
  value: Value<ValueType, ValueFormat, Optional>,
):
  | {
      result: undefined
      error: ZodError
    }
  | {
      result: Value<T, F, Optional>
      error: undefined
    } {
  if ((value === undefined || value === null) && optional) {
    return {
      result: {
        type: type,
        format: format,
        value: undefined,
      } as Value<T, F, Optional>,
      error: undefined,
    }
  }

  if (!type) throw new Error('No type defined')
  const schema = getDataTypeSchema(type, format, optional)
  if (!schema) throw new Error('No schema defined')
  try {
    const newValue = schema.parse(value)
    return {
      result: { type: type, format, value: newValue } as Value<T, F, Optional>,
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
  T extends ValueType = ValueType,
  F extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
>(
  type: T,
  format: F,
  optional: Optional,
  value?: Value<ValueType, ValueFormat, Optional>,
): boolean {
  if (!value && optional) return true
  if (!type) throw new Error('No type defined')
  const schema = getDataTypeSchema(type, format, optional)
  if (!schema) throw new Error('No schema defined')
  try {
    return schema.safeParse(value).success
  } catch (error) {
    console.log(error)
    return false
  }
}
