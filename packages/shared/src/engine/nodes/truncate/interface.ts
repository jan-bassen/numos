import type { NodeInterface } from '@repo/shared/types/node-types'

export interface TruncateNode extends NodeInterface<'data'> {
  type: 'truncate'
  category: 'data'
  inputs: {
    text: {
      type: 'string'
      list: false
    }
    length: {
      type: 'number'
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
