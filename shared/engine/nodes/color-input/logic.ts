import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ColorInputNode } from '@repo/shared/engine/nodes/color-input/interface'

export const colorInputLogic: NodeLogic<ColorInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('color')
    },
  },
}
