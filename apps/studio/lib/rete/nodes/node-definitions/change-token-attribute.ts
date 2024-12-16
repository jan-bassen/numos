import type {
  ControlDefinition,
  DataSocketDefinition,
  DefinitionInterface,
  SpecificNodeDefinition,
} from '@/types/nodes.types'
import type { ChangeTokenAttributeNode } from '@repo/engine/nodes/change-token-attribute/interface'

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
                  value: attr.slug,
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
      const attributeControlValue = getControlValue('attribute')?.value
      if (attributeControlValue) {
        const attributeType = getTokenAttribute(attributeControlValue)?.value
          .type
        if (attributeType === 'number') {
          controls.push({
            key: 'mode',
            type: 'enum',
            label: 'Mode',
            placeholder: 'Select Mode',
            default: { type: 'enum', format: 'single', value: 'set' },
            restrictions: {
              options: [
                { value: 'set', label: 'Set' },
                { value: 'incr', label: 'Incr' },
                { value: 'decr', label: 'Decr' },
              ],
            },
          })
        }
      }
      return controls
    },
    inputs: ({ getControlValue, getTokenAttribute }) => {
      const attributeKey = getControlValue('attribute')
      if (!attributeKey?.value) return []
      const attribute = getTokenAttribute(attributeKey.value)
      console.log(attribute)
      if (!attribute) return []
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
          restrictions: attribute.value.restrictions,
        },
      ]
      return inputs
    },
  }
