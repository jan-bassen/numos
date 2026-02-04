import type { NodeLogic } from '@repo/shared/types/node-types'
import type { EnumInputNode } from '@repo/shared/engine/nodes/enum-input/interface'

export const enumInputLogic: NodeLogic<EnumInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('attribute')
    },
  },
}
