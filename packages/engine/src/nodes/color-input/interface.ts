import type { NodeInterface } from '@repo/engine/types/node-types.ts'

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
