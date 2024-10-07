import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface LocationInputNode extends NodeInterface<'data'> {
  type: 'location-input'
  category: 'data'
  controls: {
    location: {
      type: 'location'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'location'
      list: false
    }
  }
}
