import type { NodeInterface } from '@repo/engine/types/node-types.ts'
import type { ValueType } from '@repo/engine/types/value-types.ts'

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
