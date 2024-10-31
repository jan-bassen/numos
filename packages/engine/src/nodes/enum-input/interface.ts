import type { NodeInterface } from '@repo/engine/types/node-types'

export interface EnumInputNode extends NodeInterface<'data'> {
  type: 'enum-input'
  category: 'data'
  controls: {
    attribute: {
      type: 'enum'
      list: false
    }
    output: {
      type: 'enum'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'enum'
      list: false
    }
  }
}
