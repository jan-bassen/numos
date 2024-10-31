import type { NodeLogic } from '@repo/engine/types/node-types'
import type { BooleanInputNode } from '@repo/engine/nodes/boolean-input/interface'

export const booleanInputLogic: NodeLogic<BooleanInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('boolean')
    },
  },
}
