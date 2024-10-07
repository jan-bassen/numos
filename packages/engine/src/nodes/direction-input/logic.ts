import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { DirectionInputNode } from './interface.ts'

export const directionInputLogic: NodeLogic<DirectionInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('direction')
    },
  },
}
