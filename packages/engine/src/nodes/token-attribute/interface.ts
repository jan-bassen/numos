import type { NodeInterface } from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/shared/types/values'

export interface TokenAttributeNode extends NodeInterface<'data'> {
  type: 'token-attribute'
  category: 'data'
  controls: {
    attribute: {
      type: 'enum'
      list: false
    }
  }
  outputs: {
    attribute: {
      type: ValueType
      list: boolean
    }
  }
}
