import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { AddressInputNode } from './interface.ts'

export const addressInputLogic: NodeLogic<AddressInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('address')
    },
  },
}
