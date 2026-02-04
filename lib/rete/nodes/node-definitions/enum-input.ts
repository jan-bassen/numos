import type {
  ControlDefinition,
  SpecificNodeDefinition,
} from '@/types/nodes.types'
import type { EnumInputNode } from '@repo/shared/engine/nodes/enum-input/interface'
import type { ValueRestrictions } from '@repo/shared/types/values'

export const enumInputDefinition: SpecificNodeDefinition<EnumInputNode> = {
  type: 'enum-input',
  category: 'data',
  title: 'Choice',
  nodeInfo: {
    description:
      'This node allows you to get the options of an choice attribute in case you want to set one manually.',
    link: '#attribute',
  },
  controls: ({ getTokenAttributes, getControlValue }) => {
    const attributes = getTokenAttributes() || []
    const enumAttributes = attributes.filter(
      (attribute) => attribute.value.type === 'enum',
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
        restrictions: { options },
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
      const restrictions = enumAttributes?.find(
        (attribute) => attribute.slug === value,
      )?.value.restrictions as ValueRestrictions<'enum'>
      controls.push({
        key: 'output',
        type: 'enum',
        restrictions,
        label: 'Choice',
      })
    }
    return controls
  },
  outputs: ({ getControlValue, getTokenAttribute }) => {
    const attributeId = getControlValue('attribute')?.value
    if (attributeId) {
      const attribute = getTokenAttribute(attributeId)

      if (!attribute) return []
      return [
        {
          key: 'output',
          type: 'enum',
          label: 'Choice',
          restrictions: attribute.value
            .restrictions as ValueRestrictions<'enum'>,
        },
      ]
    }
    return []
  },
}
