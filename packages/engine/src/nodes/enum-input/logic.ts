import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { EnumInputNode } from './interface.ts'

export const enumInputLogic: NodeLogic<EnumInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('attribute')
    },
  },
}
