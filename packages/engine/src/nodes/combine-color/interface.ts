import type { NodeInterface } from '@repo/engine/types/node-types'

export interface CombineColorNode extends NodeInterface<'data'> {
  type: 'combine-color'
  category: 'data'
  inputs: {
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
  outputs: {
    color: {
      type: 'color'
      list: false
    }
  }
}
