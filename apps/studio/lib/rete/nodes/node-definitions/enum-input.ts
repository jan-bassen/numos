import type {
  ControlDefinition,
  SpecificNodeDefinition,
} from '@/types/nodes.types'
import type { EnumInputNode } from '@repo/engine/nodes/enum-input/interface'

export const enumInputDefinition: SpecificNodeDefinition<EnumInputNode> = {
  type: 'enum-input',
  category: 'data',
  title: 'Choice',
  componentType: 'input',
  nodeInfo: {
    description:
      'This node allows you to get the options of an choice attribute in case you want to set one manually.',
    link: '#attribute',
  },
  controls: ({
    getTokenAttributes,
    getCollectionAttributes,
    getControlValue,
  }) => {
    const tokenAttributes = getTokenAttributes() || []
    const collectionAttributes = getCollectionAttributes() || []
    const attributes = [...tokenAttributes, ...collectionAttributes]
    const enumAttributes = attributes.filter(
      (attribute) => attribute.type === 'enum',
    )
    const options = enumAttributes?.map((attribute) => {
      return {
        value: attribute.slug,
        label: attribute.name || 'Unnamed Attribute',
      }
    })
    const controls: ControlDefinition<
      EnumInputNode,
      keyof EnumInputNode['controls']
    >[] = [
      {
        key: 'attribute',
        type: 'enum',
        label: 'Attribute',
        placeholder: 'Select Choice Attribute',
        settings: { options },
        onChange: (node) => {
          node.updateControls()
          node.updateControl('output', {
            type: 'enum',
            format: 'single',
            value: null,
          })
          node.updateOutputs()
        },
      },
    ]
    const value = getControlValue('attribute')?.value
    if (value) {
      const settings = enumAttributes?.find(
        (attribute) => attribute.slug === value,
      )?.settings
      controls.push({
        key: 'output',
        type: 'enum',
        settings,
        label: 'Choice',
      })
    }
    return controls
  },
  outputs: ({ getControlValue, getTokenAttribute, getCollectionAttribute }) => {
    const attributeKey = getControlValue('attribute')?.value
    if (attributeKey) {
      const attribute =
        getTokenAttribute(attributeKey) || getCollectionAttribute(attributeKey)

      if (!attribute) return []
      return [
        {
          key: 'output',
          type: 'enum',
          label: 'Choice',
          settings: attribute.settings || undefined,
        },
      ]
    }
    return []
  },
}
