import type {
  SocketInterface,
  NodeInterface,
} from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/engine/types/value-types'

export interface CollectionAttributeNode extends NodeInterface<'data'> {
  type: 'collection-attribute'
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
