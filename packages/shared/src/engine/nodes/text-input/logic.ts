import type { NodeLogic } from '@repo/shared/types/node-types'
import type { TextInputNode } from '@repo/shared/engine/nodes/text-input/interface'

export const textInputLogic: NodeLogic<TextInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('text')
    },
  },
}
