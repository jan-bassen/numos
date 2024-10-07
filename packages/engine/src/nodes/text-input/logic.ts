import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { TextInputNode } from './interface.ts'

export const textInputLogic: NodeLogic<TextInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('text')
    },
  },
}
