import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ParameterNode } from './interface.ts'

export const parameterName: NodeLogic<ParameterNode> = {
  data: {
    parameter: ({ getControlValue, getParameter }) => {
      const parameterKey = getControlValue('parameter')
      return getParameter(parameterKey.value)
    },
  },
}
