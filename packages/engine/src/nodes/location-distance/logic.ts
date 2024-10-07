import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { LocationDistanceNode } from './interface.ts'
import { getDistance } from '@repo/engine/utils.ts'

export const locationDistanceLogic: NodeLogic<LocationDistanceNode> = {
  data: {
    output: ({ getInputValue, getControlValue }) => {
      const location1 = getInputValue('loc1')
      const location2 = getInputValue('loc2')
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
