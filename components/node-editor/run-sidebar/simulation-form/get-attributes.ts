import type { ValueTypeMap, RawValue } from '@repo/shared/types/values'
import type { Attribute } from '@/types/database.types'

export function getDefaultValuesFromAttributes(
  attributes: Attribute[],
  state?: Record<string, RawValue | undefined>,
) {
  const defaultValues = attributes.reduce(
    (acc, attribute) => {
      const value = state?.[attribute.id]
      if (value !== undefined) {
        acc[attribute.id] = value
      } else {
        acc[attribute.id] = null
      }
      return acc
    },
    {} as Record<string, RawValue | null>,
  )
  return defaultValues
}

export const getAttributeTypes = (attributes: Attribute[]): ValueTypeMap => {
  return attributes.reduce((accumulator, attribute) => {
    if (!attribute.value) return accumulator
    accumulator[attribute.id] = {
      type: attribute.value.type,
      list: attribute.value.list,
    }
    return accumulator
  }, {} as ValueTypeMap)
}
