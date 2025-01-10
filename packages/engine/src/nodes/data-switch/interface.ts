import type { NodeInterface } from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/shared/types/values'

export interface DataSwitchNode extends NodeInterface<'data'> {
  type: 'data-switch'
  category: 'data'
  inputs: {
    switch: {
      type: 'boolean'
      list: false
    }
    true: {
      type: ValueType
      list: boolean
    }
    false: {
      type: ValueType
      list: boolean
    }
  }
  outputs: {
    output: {
      type: ValueType
      list: boolean
    }
  }
}
