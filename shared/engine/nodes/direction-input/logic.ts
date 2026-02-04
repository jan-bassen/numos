import type { NodeLogic } from '@repo/shared/types/node-types'
import type { DirectionInputNode } from '@repo/shared/engine/nodes/direction-input/interface'

export const directionInputLogic: NodeLogic<DirectionInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('direction')
    },
  },
}
