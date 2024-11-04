import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { CollectionAttributeNode } from '@repo/engine/nodes/collection-attribute/interface'

export const collectionAttributeDefinition: SpecificNodeDefinition<CollectionAttributeNode> =
  {
    type: 'collection-attribute',
    category: 'data',
    title: 'Collection Attribute',
    nodeInfo: {
      description:
        'This node allows you to get the value of an attribute from the collection.',
      link: '#attribute',
    },
    controls: ({ getCollectionAttributes }) => {
      const attributes = getCollectionAttributes()
      const options = attributes?.map((attribute) => {
        return {
          value: attribute.slug,
          label: attribute.name || 'Unnamed Attribute',
        }
      })
      return [
        {
          key: 'attribute',
          type: 'enum',
          placeholder: 'Select Attribute',
          options,
          onChange: (node) => {
            node.updateOutputs()
          },
        },
      ]
    },
    outputs: ({ getCollectionAttribute, getControlValue }) => {
      const attributeKey = getControlValue('attribute')?.value
      if (!attributeKey) return []
      const attribute = getCollectionAttribute(attributeKey)
      if (!attribute) return []
      return [
        {
          key: 'attribute',
          type: attribute.type,
          list: attribute.list,
          label: attribute.name || 'Unnamed Attribute',
          attributes: attribute.settings,
        },
      ]
    },
  }
