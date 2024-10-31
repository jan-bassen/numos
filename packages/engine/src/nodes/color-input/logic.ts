import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ColorInputNode } from '@repo/engine/nodes/color-input/interface'

export const colorInputLogic: NodeLogic<ColorInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('color')
    },
  },
}
