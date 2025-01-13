import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { TokenAttributeNode } from '@repo/shared/engine/nodes/token-attribute/interface'

export const tokenAttributeDefinition: SpecificNodeDefinition<TokenAttributeNode> =
  {
    type: 'token-attribute',
    category: 'data',
    title: 'Attribute',
    nodeInfo: {
      description:
        'This node allows you to get the value of an attribute from the token.',
      link: '#attribute',
    },
    controls: ({ getTokenAttributes }) => {
      const attributes = getTokenAttributes()
      const options =
        attributes?.map((attribute) => {
          return {
            value: attribute.id,
            label: attribute.name || 'Unnamed Attribute',
          }
        }) || []
      return [
        {
          key: 'attribute',
          type: 'enum',
          placeholder: 'Select Attribute',
          restrictions: {
            options,
          },
          onChange: (node) => {
            node.updateOutputs()
          },
        },
      ]
    },
    outputs: ({ getTokenAttribute, getControlValue }) => {
      const attributeId = getControlValue('attribute')?.value
      if (!attributeId) return []
      const attribute = getTokenAttribute(attributeId)
      if (!attribute) return []
      return [
        {
          key: 'attribute',
          type: attribute.value.type,
          list: attribute.value.list,
          label: attribute.name || 'Unnamed Attribute',
          restrictions: attribute.value.restrictions || {},
        },
      ]
    },
  }
