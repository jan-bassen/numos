import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface SplitColorNode extends NodeInterface<'data'> {
  type: 'split-color'
  category: 'data'
  inputs: {
    color: {
      type: 'color'
      list: false
    }
  }
  outputs: {
    red: {
      type: 'number'
      list: false
    }
    green: {
      type: 'number'
      list: false
    }
    blue: {
      type: 'number'
      list: false
    }
    alpha: {
      type: 'number'
      list: false
    }
  }
}
