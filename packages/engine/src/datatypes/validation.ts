import { ZodError } from 'zod'
import type {
  RawValue,
  Value,
  ValueFormat,
  ValueType,
} from '@repo/engine/types/value-types'
import { getDataTypeSchema } from '@repo/engine/datatypes/schemas'

export function validateValue<Optional extends boolean = false>(
  value: Value<ValueType, ValueFormat, boolean>,
  optional: Optional,
):
  | {
      validated: undefined
      error: ZodError
    }
  | {
      validated: Value<ValueType, ValueFormat, Optional>
      error: undefined
    } {
  return explicitlyValidateValue<ValueType, ValueFormat, boolean>(
    value.type,
    value.format,
    optional,
    value,
  ) as
    | {
        validated: undefined
        error: ZodError
      }
    | {
        validated: Value<ValueType, ValueFormat, Optional>
        error: undefined
      }
}

export function explicitlyValidateValue<
  T extends ValueType = ValueType,
  F extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
>(
  type: T,
  format: F,
  optional: Optional,
  value: Value<ValueType, ValueFormat, boolean>,
):
  | {
      validated: undefined
      error: ZodError
    }
  | {
      validated: Value<T, F, Optional>
      error: undefined
    } {
  if (
    value === undefined ||
    value === null ||
    value.value === undefined ||
    value.value === null ||
    value.value === ''
  ) {
    if (optional) {
      return {
        validated: {
          type: type,
          format: format,
          value: undefined,
        } as Value<T, F, Optional>,
        error: undefined,
      }
    }
    throw new Error('Value is not optional')
  }

  if (!type) throw new Error('No type defined')
  const schema = getDataTypeSchema(type, format, optional)
  if (!schema) throw new Error('No schema defined')
  try {
    const newValue = schema.parse(value.value)
    return {
      validated: { type: type, format, value: newValue } as Value<
        T,
        F,
        Optional
      >,
      error: undefined,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error, validated: undefined }
    }
    throw new Error('Unexpected error with parsing value')
  }
}

export function validateRawValue<
  T extends ValueType = ValueType,
  F extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
>(
  type: T,
  format: F,
  optional: Optional,
  value: RawValue<T, F, Optional>,
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
