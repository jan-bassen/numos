import type { NodeInterface } from '@repo/engine/types/node-types.ts'

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
