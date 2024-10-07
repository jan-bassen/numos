import type {
  NodeComponentType,
  NodeInterface,
} from '@repo/engine/types/node-types.ts'

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
    attribute: NodeComponentType
  }
}
