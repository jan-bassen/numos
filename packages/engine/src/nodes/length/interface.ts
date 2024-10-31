import type { NodeInterface } from '@repo/engine/types/node-types'

export interface LengthNode extends NodeInterface<'data'> {
  type: 'length'
  category: 'data'
  inputs: {
    text: {
      type: 'string'
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
