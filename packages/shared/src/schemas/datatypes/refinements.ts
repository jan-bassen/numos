import type {
  ObjectValue,
  RawValueTypesMap,
  ValueFormat,
  ValueTypeLiteral,
} from '@repo/shared/types/values'
import { isArray } from 'lodash'

export function validateDefaultFormat<
  S extends {
    type: ValueTypeLiteral
    list: boolean
    default?: {
      format: ValueFormat
      type: ValueTypeLiteral
      value?: any
    }
  },
>(schema: S) {
  if (schema.list && schema.default) {
    return schema.default.format === 'objectarray'
  }
  if (schema.list === false && schema.default) {
    return schema.default.format === 'single'
  }
  return true
}

export function validateDefaultValue<
  T extends ValueTypeLiteral,
  S extends {
    type: T
    list: boolean
    default?: {
      format: ValueFormat
      type: ValueTypeLiteral
      value?: any
    }
  },
>(schema: S, validation: (value: RawValueTypesMap[T]) => boolean) {
  if (schema.default?.value) {
    if (isArray(schema.default.value) && schema.list) {
      return schema.default.value.every(
        (entry: ObjectValue<RawValueTypesMap[T]> | RawValueTypesMap[T]) => {
          if (isObjectValue(entry)) {
            return validation(entry.value)
          }
          return validation(entry)
        },
      )
    }
    return validation(schema.default.value)
  }
  return true
}

// TODO: Move out
function isObjectValue<T extends ValueTypeLiteral>(
  value: RawValueTypesMap[T] | ObjectValue<RawValueTypesMap[T]>,
): value is ObjectValue<RawValueTypesMap[T]> {
  if (typeof value === 'object') {
    if ('id' in value) return true
    if ('r' in value || 'g' in value || 'b' in value) return false
    if ('lat' in value || 'lng' in value) return false
    return true
  }
  return false
}
