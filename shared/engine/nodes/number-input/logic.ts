import type { NodeLogic } from '@repo/shared/types/node-types'
import type { NumberInputNode } from '@repo/shared/engine/nodes/number-input/interface'

export const numberInputLogic: NodeLogic<NumberInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('number')
    },
  },
}
