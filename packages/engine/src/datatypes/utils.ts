import type {
  ObjectValue,
  RawValue,
  Value,
  ValueFormat,
  ValueType,
} from '../types/value-types.ts'

export function singleValueToText(data: Value<undefined, 'single'>): string {
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
      return `${data.value.r}, ${data.value.g}, ${data.value.b}, ${data.value.a}`
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
  value: Value<undefined, F>,
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
          } as Value<undefined, 'single'>),
        )
        .join(', ')}]`
    case 'objectarray':
      return `[${value.value
        .map((v) =>
          singleValueToText({
            type: value.type,
            format: 'single',
            value: v.value,
          } as Value<undefined, 'single'>),
        )
        .join(', ')}]`
    default:
      throw new Error('Invalid value format')
  }
}

export function getDefinedValuesFromObjectArray<VT extends RawValue = RawValue>(
  objectArray: ObjectValue<VT, true>[],
) {
  const definedValues: ObjectValue<VT, false>[] = objectArray.filter(
    (object) => object.value !== null && object.value !== undefined,
  ) as unknown as ObjectValue<VT, false>[]
  return definedValues
}
