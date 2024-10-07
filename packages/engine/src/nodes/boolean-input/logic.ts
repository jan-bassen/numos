import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { BooleanInputNode } from './interface.ts'

export const booleanInputLogic: NodeLogic<BooleanInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('boolean')
    },
  },
}
