import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface LocationDistanceNode extends NodeInterface<'data'> {
  type: 'location-distance'
  category: 'data'
  inputs: {
    loc1: {
      type: 'location'
      list: false
    }
    loc2: {
      type: 'location'
      list: false
    }
  }
  controls: {
    unit: {
      type: 'enum'
      list: false
      settings: {
        options: [
          {
            value: 'km'
            label: 'Kilometers'
          },
          {
            value: 'mile'
            label: 'Miles'
          },
          {
            value: 'meter'
            label: 'Meters'
          },
          {
            value: 'yard'
            label: 'Yards'
          },
          {
            value: 'nautical mile'
            label: 'Nautical Miles'
          },
        ]
      }
    }
  }
  outputs: {
    output: {
      type: 'number'
      list: false
    }
  }
}
