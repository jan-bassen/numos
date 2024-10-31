import type { NodeLogic } from '@repo/engine/types/node-types'
import type { AddressInputNode } from '@repo/engine/nodes/address-input/interface'

export const addressInputLogic: NodeLogic<AddressInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('address')
    },
  },
}
