import type { NodeInterface } from '@repo/engine/types/node-types'

export interface RandomNode extends NodeInterface<'data'> {
  type: 'random'
  category: 'data'
  inputs: {
    min: {
      type: 'number'
      list: false
    }
    max: {
      type: 'number'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'number'
      list: false
    }
  }
}
