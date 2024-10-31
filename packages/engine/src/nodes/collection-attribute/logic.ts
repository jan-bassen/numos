import type { NodeLogic } from '@repo/engine/types/node-types'
import type { CollectionAttributeNode } from '@repo/engine/nodes/collection-attribute/interface'

export const collectionAttributeLogic: NodeLogic<CollectionAttributeNode> = {
  data: {
    attribute: ({ getControlValue, getCollectionAttribute }) => {
      const attributeKey = getControlValue('attribute')
      return getCollectionAttribute(attributeKey.value)
    },
  },
}
