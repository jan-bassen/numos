import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ParameterNode } from '@repo/engine/nodes/parameter/interface'

export const parameterLogic: NodeLogic<ParameterNode> = {
  data: {
    parameter: ({ getControlValue, getParameter }) => {
      const parameterKey = getControlValue('parameter')
      return getParameter(parameterKey.value)
    },
  },
}
