import type { NodeInterface } from '@repo/engine/types/node-types.ts'
import type { ValueType } from '@repo/engine/types/value-types.ts'

export interface IsInListNode extends NodeInterface<'data'> {
  type: 'is-in-list'
  category: 'data'
  inputs: {
    list: {
      type: ValueType
      list: true
    }
    value: {
      type: ValueType
      list: false
    }
  }
  outputs: {
    output: {
      type: 'boolean'
      list: false
    }
  }
}
