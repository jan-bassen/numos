import type { ParameterInfo, ParameterState } from '@/types/actions.types'
import { datatypeSchema } from '@repo/engine/datatypes/schemas'
import type { ValueMap, ValueTypeMap } from '@repo/engine/types/value-types'
import { z } from 'zod'

export const getParametersSchema = (
  params: ParameterInfo[],
  optional?: boolean,
) =>
  z.object(
    Object.fromEntries(
      params.map((param) => [
        param.key,
        param.list
          ? optional
            ? z.array(
                z.object({
                  value: datatypeSchema[param.type].nullable().optional(),
                }),
              )
            : z.array(z.object({ value: datatypeSchema[param.type] }))
          : optional
            ? datatypeSchema[param.type].nullable().optional()
            : datatypeSchema[param.type],
      ]),
    ),
  )

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
    accumulator[parameter.key] = { type: parameter.type, list: parameter.list }
    return accumulator
  }, {} as ValueTypeMap)
}
