import type { NodeInterface } from '@repo/shared/types/node-types'

export interface DatetimeInputNode extends NodeInterface<'data'> {
  type: 'datetime-input'
  category: 'data'
  controls: {
    datetime: {
      type: 'datetime'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'datetime'
      list: false
    }
  }
}
