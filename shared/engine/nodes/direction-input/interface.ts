import type { NodeInterface } from '@repo/shared/types/node-types'

export interface DirectionInputNode extends NodeInterface<'data'> {
  type: 'direction-input'
  category: 'data'
  controls: {
    direction: {
      type: 'direction'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'direction'
      list: false
    }
  }
}
