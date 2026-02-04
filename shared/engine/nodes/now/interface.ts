import type { NodeInterface } from '@repo/shared/types/node-types'

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
