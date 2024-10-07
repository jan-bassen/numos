import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface ClampNode extends NodeInterface<'data'> {
  type: 'clamp'
  category: 'data'
  inputs: {
    number: {
      type: 'number'
      list: false
    }
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
