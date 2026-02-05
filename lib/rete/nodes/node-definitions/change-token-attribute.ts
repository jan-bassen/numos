import type {
  ControlDefinition,
  DataSocketDefinition,
  SpecificNodeDefinition,
} from '@/types/nodes.types'
import type { ChangeTokenAttributeNode } from '@repo/shared/engine/nodes/change-token-attribute/interface'

export const changeTokenAttributeDefinition: SpecificNodeDefinition<ChangeTokenAttributeNode> =
  {
    type: 'change-token-attribute',
    category: 'exec',
    title: 'Change Attribute',
    forwards: [{ type: 'exec', key: 'exec', label: 'Execute' }],
    nodeInfo: {
      description:
        'With this node you can change one of the token specific attributes.',
      link: '#',
    },
    controls: ({ getTokenAttributes, getTokenAttribute, getControlValue }) => {
      const attributes = getTokenAttributes()
      const controls: ControlDefinition<
        ChangeTokenAttributeNode,
        keyof ChangeTokenAttributeNode['controls']
      >[] = [
        {
          key: 'attribute',
          type: 'enum',
          label: 'Attribute',
          placeholder: 'Select Attribute',
          restrictions: {
            options:
              attributes?.map((attr) => {
                return {
                  value: attr.id,
                  label: attr.name || 'Unnamed Attribute',
                }
              }) || [],
          },
          onChange: (node) => {
            node.updateInputs()
            node.updateControls()
          },
        },
      ]
      const attributeId = getControlValue('attribute')?.value
      if (attributeId) {
        const attr = getTokenAttribute(attributeId)
        const attributeType = attr?.value?.type
        if (attributeType === 'number') {
          controls.push({
            key: 'mode',
            type: 'enum',
            label: 'Mode',
            placeholder: 'Select Mode',
            default: { type: 'enum', format: 'single', value: 'set' },
            restrictions: {
              options: [
                { value: 'set', label: 'Set Value' },
                { value: 'incr', label: 'Increase' },
                { value: 'decr', label: 'Decrease' },
              ],
            },
          })
        }
      }
      return controls
    },
    inputs: ({ getControlValue, getTokenAttribute }) => {
      const attributeId = getControlValue('attribute')
      if (!attributeId?.value) return []
      const attribute = getTokenAttribute(attributeId.value)
      if (!attribute || !attribute.value) return []
      const inputs: DataSocketDefinition<
        ChangeTokenAttributeNode,
        'inputs',
        'value'
      >[] = [
        {
          type: attribute.value.type,
          list: attribute.value.list,
          key: 'value',
          label: 'Attribute',
          restrictions: attribute.value.restrictions || {},
        },
      ]
      return inputs
    },
  }
