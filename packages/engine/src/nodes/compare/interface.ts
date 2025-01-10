import type { NodeInterface } from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/shared/types/values'

export interface CompareNode extends NodeInterface<'data'> {
  type: 'compare'
  category: 'data'
  inputs: {
    value1: {
      type: ValueType
      list: boolean
    }
    value2: {
      type: ValueType
      list: boolean
    }
  }
  controls: {
    mode: {
      type: 'enum'
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
