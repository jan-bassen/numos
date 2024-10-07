import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface BooleanInputNode extends NodeInterface<'data'> {
  type: 'boolean-input'
  category: 'data'
  controls: {
    boolean: {
      type: 'boolean'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'boolean'
      list: false
    }
  }
}
