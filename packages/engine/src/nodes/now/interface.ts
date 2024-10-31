import type { NodeInterface } from '@repo/engine/types/node-types'

export interface NowNode extends NodeInterface<'data'> {
  type: 'now'
  category: 'data'
  outputs: {
    output: {
      type: 'datetime'
      list: false
    }
  }
}
