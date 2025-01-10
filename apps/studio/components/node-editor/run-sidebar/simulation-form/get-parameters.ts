import type { Parameter } from '@/lib/schemas/actions/triggers/api'
import type { ParameterState } from '@/types/actions.types'
import type { ValueMap, ValueTypeMap } from '@repo/shared/types/values'

export function getDefaultValuesFromParameters(
  parameters: Parameter[],
  state?: ParameterState,
) {
  const defaultValues = parameters.reduce((acc, parameter) => {
    const value = state?.[parameter.key]
    if (value) {
      acc[parameter.key] = value
    }
    return acc
  }, {} as ValueMap)
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
