import type { NodeLogic } from '@repo/shared/types/node-types'
import type { LocationDistanceNode } from '@repo/shared/engine/nodes/location-distance/interface'
import { getDistance } from '@repo/shared/utils/distance-from-coordinates'

export const locationDistanceLogic: NodeLogic<LocationDistanceNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const location1 = await getInputValue('loc1')
      const location2 = await getInputValue('loc2')
      const unit = getControlValue('unit').value
      if (
        unit !== 'km' &&
        unit !== 'meter' &&
        unit !== 'mile' &&
        unit !== 'yard' &&
        unit !== 'nautical mile'
      ) {
        throw new Error('Invalid unit')
      }
      return {
        type: 'number',
        format: 'single',
        value: getDistance(location1.value, location2.value, unit),
      }
    },
  },
}
