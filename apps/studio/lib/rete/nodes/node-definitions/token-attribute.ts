import type { NodeDefinition2 } from '@/types/nodes.types'
import type { TokenAttributeNode } from '@repo/engine/src/nodes/token-attribute/interface'

export const tokenAttributeDefinition: NodeDefinition2<TokenAttributeNode> = {
  type: 'token-attribute',
  category: 'data',
  title: 'Token Attribute',
  nodeInfo: {
    description:
      'This node allows you to get the value of an attribute from the token.',
    link: '#attribute',
  },
  controls: ({ getTokenAttributes }) => {
    const attributes = getTokenAttributes()
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
  outputs: ({ getTokenAttribute, getControlValue }) => {
    const attributeKey = getControlValue('attribute').value
    if (!attributeKey) return []
    const attribute = getTokenAttribute(attributeKey)
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
