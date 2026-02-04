import type { NodeInterface } from '@repo/shared/types/node-types'

export interface TextInputNode extends NodeInterface<'data'> {
  type: 'text-input'
  category: 'data'
  controls: {
    text: {
      type: 'string'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'string'
      list: false
    }
  }
}
