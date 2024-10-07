import type {
  NodeComponentType,
  NodeInterface,
} from '@repo/engine/types/node-types.ts'

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
    attribute: NodeComponentType
  }
}
