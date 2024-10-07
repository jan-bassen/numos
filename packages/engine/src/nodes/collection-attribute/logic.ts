import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { CollectionAttributeNode } from './interface.ts'

export const collectionAttributeLogic: NodeLogic<CollectionAttributeNode> = {
  data: {
    attribute: ({ getControlValue, getCollectionAttribute }) => {
      const attributeKey = getControlValue('attribute')
      return getCollectionAttribute(attributeKey.value)
    },
  },
}
