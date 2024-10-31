import type { NodeLogic } from '@repo/engine/types/node-types'
import type { LocationInputNode } from '@repo/engine/nodes/location-input/interface'

export const locationInputLogic: NodeLogic<LocationInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('location')
    },
  },
}
