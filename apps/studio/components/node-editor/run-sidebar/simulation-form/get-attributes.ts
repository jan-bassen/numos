import type {
  Value,
  ValueTypeMap,
  ValueFormat,
  ValueMap,
  ValueType,
} from '@repo/shared/types/values'
import type { Attribute } from '@/types/database.types'

export function getDefaultValuesFromAttributes(
  attributes: Attribute[],
  state?: ValueMap<string, ValueType, ValueFormat, true>,
) {
  const defaultValues = attributes.reduce(
    (acc, attribute) => {
      const value = state?.[attribute.id]
      if (value !== undefined && value !== null) {
        acc[attribute.id] = value
      } else if (
        attribute.value.default !== undefined &&
        attribute.value.default !== null
      ) {
        acc[attribute.id] = attribute.value.default as Value<
          typeof attribute.value.default.type,
          typeof attribute.value.default.format,
          true
        >
      }
      return acc
    },
    {} as ValueMap<string, ValueType, ValueFormat, true>,
  )
  return defaultValues
}

export const getAttributeTypes = (attributes: Attribute[]): ValueTypeMap => {
  return attributes.reduce((accumulator, attribute) => {
    accumulator[attribute.id] = { type: attribute.type, list: attribute.list }
    return accumulator
  }, {} as ValueTypeMap)
}
