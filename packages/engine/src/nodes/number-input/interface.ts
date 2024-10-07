import type { NodeInterface } from '@repo/engine/types/node-types.ts'

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
