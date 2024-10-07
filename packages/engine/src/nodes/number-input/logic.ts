import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { NumberInputNode } from './interface.ts'

export const numberInputLogic: NodeLogic<NumberInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('number')
    },
  },
}
