import type { Parameter } from '@/lib/schemas/actions/triggers/api'
import type { RawValue, ValueTypeMap } from '@repo/shared/types/values'

export function getDefaultValuesFromParameters(
  parameters: Parameter[],
  state?: Record<string, RawValue | undefined | null>,
) {
  const defaultValues = parameters.reduce(
    (acc, parameter) => {
      const value = state?.[parameter.key]
      if (value !== undefined) {
        acc[parameter.key] = value
      }
      return acc
    },
    {} as Record<string, RawValue | null>,
  )
  return defaultValues
}

export const getParameterTypes = (parameters: Parameter[]): ValueTypeMap => {
  return parameters.reduce((accumulator, parameter) => {
    accumulator[parameter.key] = {
      type: parameter.value.type,
      list: parameter.value.list,
    }
    return accumulator
  }, {} as ValueTypeMap)
}
