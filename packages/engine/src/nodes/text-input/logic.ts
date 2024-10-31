import type { NodeLogic } from '@repo/engine/types/node-types'
import type { TextInputNode } from '@repo/engine/nodes/text-input/interface'

export const textInputLogic: NodeLogic<TextInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('text')
    },
  },
}
