import type { NodeInterface } from '@repo/engine/types/node-types'

export interface RoundNode extends NodeInterface<'data'> {
  type: 'round'
  category: 'data'
  inputs: {
    number: {
      type: 'number'
      list: false
    }
    precision: {
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
