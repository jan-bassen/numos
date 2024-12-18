import type { ValueTypeMap } from '@repo/engine/types/value-types'
import type { ValueFormat } from '@repo/engine/types/value-types'
import type { ValueMap } from '@repo/engine/types/value-types'
import type { ValueType } from '@repo/engine/types/value-types'
import type { Attribute } from '@/types/database.types'

export function getDefaultValuesFromAttributes(
  attributes: Attribute[],
  state?: ValueMap<string, ValueType, ValueFormat, true>,
) {
  const defaultValues = attributes.reduce(
    (acc, attribute) => {
      const value = state?.[attribute.slug]
      if (value !== undefined && value !== null) {
        acc[attribute.slug] = value
      } else if (
        attribute.value.default !== undefined &&
        attribute.value.default !== null
      ) {
        acc[attribute.slug] = attribute.value.default
      }
      return acc
    },
    {} as ValueMap<string, ValueType, ValueFormat, true>,
  )
  return defaultValues
}

export const getAttributeTypes = (attributes: Attribute[]): ValueTypeMap => {
  return attributes.reduce((accumulator, attribute) => {
    accumulator[attribute.slug] = { type: attribute.type, list: attribute.list }
    return accumulator
  }, {} as ValueTypeMap)
}
