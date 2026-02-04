import type { NodeInterface } from '@repo/shared/types/node-types'

export interface NumberInputNode extends NodeInterface<'data'> {
  type: 'number-input'
  category: 'data'
  controls: {
    number: {
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
