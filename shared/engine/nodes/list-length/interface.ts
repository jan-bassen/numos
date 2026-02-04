import type { NodeInterface } from '@repo/shared/types/node-types'
import type { ValueType } from '@repo/shared/types/values'

export interface ListLengthNode extends NodeInterface<'data'> {
  type: 'list-length'
  category: 'data'
  inputs: {
    list: {
      type: ValueType
      list: true
    }
  }
  outputs: {
    output: {
      type: 'number'
      list: false
    }
  }
}
