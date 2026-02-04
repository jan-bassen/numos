import type { NodeLogic } from '@repo/shared/types/node-types'
import type { AddressInputNode } from '@repo/shared/engine/nodes/address-input/interface'

export const addressInputLogic: NodeLogic<AddressInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('address')
    },
  },
}
