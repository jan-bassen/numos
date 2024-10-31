import type { NodeInterface } from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/engine/types/value-types'

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
