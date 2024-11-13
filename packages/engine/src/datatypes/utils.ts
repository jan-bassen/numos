import { isArray } from 'lodash'
import type {
  ObjectValue,
  RawSingleValue,
  RawValueMap,
  Value,
  ValueFormat,
  ValueMap,
  ValueType,
  ValueTypeMap,
} from '@repo/engine/types/value-types'
import { explicitlyValidateValue } from '@repo/engine/datatypes/validation'

export function singleValueToText(data: Value<ValueType, 'single'>): string {
  switch (data.type) {
    case 'string':
      return data.value
    case 'number':
      return data.value.toString()
    case 'boolean':
      return data.value ? 'true' : 'false'
    case 'address':
      return data.value
    case 'color':
      return `{r: ${data.value.r}, g: ${data.value.g}, b: ${data.value.b}, a: ${data.value.a}}`
    case 'datetime':
      return new Date(data.value).toISOString()
    case 'location':
      return `${data.value.lat.toFixed(2)}, ${data.value.lng.toFixed(2)}`
    case 'weather':
      return data.value.toLowerCase()
    case 'image':
      return data.value
    case 'buffer':
      return `Buffer: ${data.value.toString().slice(0, 20)}...`
    case 'enum':
      return data.value
    default:
      throw new Error('Unsupported type')
  }
}

export function valueToText<F extends ValueFormat = ValueFormat>(
  value: Value<ValueType, F>,
): string {
  switch (value.format) {
    case 'single':
      return singleValueToText(value)
    case 'array':
      return `[${value.value
        .map((v) =>
          singleValueToText({
            type: value.type,
            format: 'single',
            value: v,
          } as Value<ValueType, 'single'>),
        )
        .join(', ')}]`
    case 'objectarray':
      return `[${value.value
        .map((v) =>
          singleValueToText({
            type: value.type,
            format: 'single',
            value: v.value,
          } as Value<ValueType, 'single'>),
        )
        .join(', ')}]`
    default:
      throw new Error('Invalid value format')
  }
}

export function getDefinedValuesFromObjectArray<
  VT extends RawSingleValue = RawSingleValue,
>(objectArray: ObjectValue<VT, true>[]) {
  const definedValues: ObjectValue<VT, false>[] = objectArray.filter(
    (object) => object.value !== null && object.value !== undefined,
  ) as unknown as ObjectValue<VT, false>[]
  return definedValues
}

export function resolveObjectArrayValue<
  VT extends ValueType = ValueType,
  Format extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
>(value: Value<VT, Format, Optional>): Value<VT, 'single' | 'array', Optional> {
  if (value.format === 'single') {
    return value as Value<VT, 'single' | 'array', Optional>
  }
  if (value.format === 'array') {
    return {
      type: value.type,
      format: 'array',
      value: value.value,
    } as Value<VT, 'single' | 'array', Optional>
  }
  return {
    type: value.type,
    format: 'array',
    value: value.value.map((v) => v.value),
  } as Value<VT, 'single' | 'array', Optional>
}

export function generateValueMap(
  state: RawValueMap,
  typeMap: ValueTypeMap,
): ValueMap<string, ValueType, 'single' | 'objectarray', true> {
  return Object.entries(state).reduce<
    ValueMap<string, ValueType, 'single' | 'objectarray', true>
  >(
    (accumulator, [key, value]) => {
      if (value === undefined || value === null) {
        return accumulator
      }
      const typeEntry = typeMap[key]
      if (!typeEntry) {
        throw new Error('Type not found')
      }
      /*       if (typeEntry?.list && !isArray(value)) {
        throw new Error('Value is not an array')
      }

      const { validated, error } = explicitlyValidateValue<
        ValueType,
        'single' | 'objectarray',
        false
      >(typeEntry.type, typeEntry.list ? 'objectarray' : 'single', false, {
        type: typeEntry.type,
        format: typeEntry.list ? 'objectarray' : 'single',
        value,
      } as Value<ValueType, 'single' | 'objectarray', false>)

      if (error) {
        throw new Error('Error with parsing value')
      } 

      let resolvedValue: Value<ValueType, 'single' | 'array', false>
      if (validated.format === 'objectarray') {
        resolvedValue = resolveObjectArrayValue<ValueType, ValueFormat, false>(
          validated,
        )
      } else {
        resolvedValue = validated
      }*/

      //TODO: Also validate here?!
      accumulator[key] = {
        type: typeEntry.type,
        format: typeEntry.list ? 'objectarray' : 'single',
        value,
      } as Value<ValueType, 'single' | 'objectarray', true>
      return accumulator
    },
    {} as ValueMap<string, ValueType, 'single' | 'objectarray', true>,
  )
}

export function isListFormat<
  T extends ValueType = ValueType,
  Optional extends boolean = false,
>(
  value: Value<T, ValueFormat, Optional>,
): value is Value<T, 'array' | 'objectarray', Optional> {
  return value.format === 'array' || value.format === 'objectarray'
}
