import type {
  ControlDefinition,
  SpecificNodeDefinition,
} from '@/types/nodes.types'
import type { ChangeTokenAttributeNode } from '@repo/engine/nodes/change-token-attribute/interface'

export const changeTokenAttributeDefinition: SpecificNodeDefinition<ChangeTokenAttributeNode> =
  {
    type: 'change-token-attribute',
    category: 'exec',
    title: 'Change Token Attribute',
    forwards: [{ key: 'exec', label: 'Execute' }],
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
          settings: {
            options: attributes?.map((attr) => {
              return {
                value: attr.slug,
                label: attr.name || 'Unnamed Attribute',
              }
            }),
          },
          onChange: (node) => {
            node.updateInputs()
            node.updateControls()
          },
        },
      ]
      const attributeControlValue = getControlValue('attribute').value
      if (attributeControlValue) {
        const attributeType = getTokenAttribute(attributeControlValue)?.type
        if (attributeType === 'number') {
          controls.push({
            key: 'mode',
            type: 'enum',
            label: 'Mode',
            placeholder: 'Select Mode',
            settings: {
              options: [
                { value: 'set', label: 'Set' },
                { value: 'incr', label: 'Incr' },
                { value: 'decr', label: 'Decr' },
              ],
              default: 'set',
            },
          })
        }
      }
      return controls
    },
  }
