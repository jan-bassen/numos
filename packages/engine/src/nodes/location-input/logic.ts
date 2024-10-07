import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { LocationInputNode } from './interface.ts'

export const locationInputLogic: NodeLogic<LocationInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('location')
    },
  },
}
