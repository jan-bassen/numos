import type { NodeLogic } from '@repo/engine/types/node-types'
import type { EnumInputNode } from '@repo/engine/nodes/enum-input/interface'

export const enumInputLogic: NodeLogic<EnumInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('attribute')
    },
  },
}
