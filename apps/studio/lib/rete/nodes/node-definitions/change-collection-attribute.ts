import type {
  ControlDefinition,
  SpecificNodeDefinition,
} from '@/types/nodes.types'
import type { ChangeCollectionAttributeNode } from '@repo/engine/nodes/change-collection-attribute/interface'

export const changeCollectionAttributeDefinition: SpecificNodeDefinition<ChangeCollectionAttributeNode> =
  {
    type: 'change-collection-attribute',
    category: 'exec',
    title: 'Change Collection Attribute',
    forwards: [{ key: 'exec', label: 'Execute' }],
    nodeInfo: {
      description:
        'With this node you can change one of the collectio wide attributes.',
      link: '#',
    },
    controls: ({
      getCollectionAttributes,
      getCollectionAttribute,
      getControlValue,
    }) => {
      const attributes = getCollectionAttributes()
      const controls: ControlDefinition<
        ChangeCollectionAttributeNode,
        keyof ChangeCollectionAttributeNode['controls']
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
        const attributeType = getCollectionAttribute(
          attributeControlValue,
        )?.type
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
