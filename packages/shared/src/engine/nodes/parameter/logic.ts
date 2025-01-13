import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ParameterNode } from '@repo/shared/engine/nodes/parameter/interface'

export const parameterLogic: NodeLogic<ParameterNode> = {
  data: {
    parameter: ({ getControlValue, getParameter }) => {
      const parameterKey = getControlValue('parameter')
      return getParameter(parameterKey.value)
    },
  },
}
