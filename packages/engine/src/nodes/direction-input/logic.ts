import type { NodeLogic } from '@repo/engine/types/node-types'
import type { DirectionInputNode } from '@repo/engine/nodes/direction-input/interface'

export const directionInputLogic: NodeLogic<DirectionInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('direction')
    },
  },
}
