import type { ParameterState, ParameterInfo } from '@/types/actions.types'
import type { ValueMap, ValueTypeMap } from '@repo/engine/types/value-types'

export function getDefaultValuesFromParameters(
  parameters: ParameterInfo[],
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

export const getParameterTypes = (
  parameters: ParameterInfo[],
): ValueTypeMap => {
  return parameters.reduce((accumulator, parameter) => {
    accumulator[parameter.key] = {
      type: parameter.value.type,
      list: parameter.value.list,
    }
    return accumulator
  }, {} as ValueTypeMap)
}
