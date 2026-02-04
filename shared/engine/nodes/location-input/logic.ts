import type { NodeLogic } from '@repo/shared/types/node-types'
import type { LocationInputNode } from '@repo/shared/engine/nodes/location-input/interface'

export const locationInputLogic: NodeLogic<LocationInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('location')
    },
  },
}
