import type { NodeInterface } from '@repo/shared/types/node-types'

export interface ColorInputNode extends NodeInterface<'data'> {
  type: 'color-input'
  category: 'data'
  controls: {
    color: {
      type: 'color'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'color'
      list: false
    }
  }
}
