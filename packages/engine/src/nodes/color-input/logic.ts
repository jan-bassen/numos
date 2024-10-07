import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ColorInputNode } from './interface.ts'

export const colorInputLogic: NodeLogic<ColorInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('color')
    },
  },
}
