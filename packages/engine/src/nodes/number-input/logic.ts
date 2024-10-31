import type { NodeLogic } from '@repo/engine/types/node-types'
import type { NumberInputNode } from '@repo/engine/nodes/number-input/interface'

export const numberInputLogic: NodeLogic<NumberInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('number')
    },
  },
}
