import type { NodeDefinition2, SocketDefinition2 } from '@/types/nodes.types'
import type { MapToChoiceNode } from '@repo/engine/src/nodes/map-to-choice/interface'

export const mapToChoiceDefinition: NodeDefinition2<MapToChoiceNode> = {
  type: 'map-to-choice',
  category: 'data',
  title: 'Map to Choice',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description:
      'This node allows you to map a value to every option of a choice attribute.',
    link: '#attribute',
  },
  inputs: ({
    getInfoFromInputConnection,
    getInfoFromInputConnections,
    getConnectedInputKeys,
  }) => {
    const { settings } = getInfoFromInputConnection<'enum'>('value')
    const {
      type,
      list,
      settings: inputSettings,
    } = getInfoFromInputConnections(
      getConnectedInputKeys().filter((key) => key !== 'value'),
    )

    // TODO: Make cleaner?
    const inputOptions =
      settings && 'options' in settings ? settings.options : []

    const optionsInputs: SocketDefinition2<
      MapToChoiceNode,
      'inputs',
      string
    >[] =
      inputOptions?.map((option) => {
        return {
          key: option.value,
          type,
          list,
          settings: inputSettings,
          hideControl: true,
          label: option.value,
          onConnect: (node) => {
            node.updateInputs()
            node.updateOutputs()
          },
          onDisconnect: (node) => {
            node.updateInputs()
            node.updateOutputs()
          },
        }
      }) || []

    const valueInput: SocketDefinition2<MapToChoiceNode, 'inputs', 'value'> = {
      key: 'value',
      type: 'enum',
      label: 'Choice Value',
      settings,
      dividerAfter: optionsInputs.length > 0,
      hideControl: true,
      list: false,
      onConnect: (node) => {
        node.updateInputs()
        node.updateOutputs()
      },
      onDisconnect: (node) => {
        node.updateInputs()
        node.updateOutputs()
      },
    }

    return [valueInput, ...optionsInputs]
  },
  outputs: ({ getInfoFromInputConnections, getConnectedInputKeys }) => {
    const { type, list, settings } = getInfoFromInputConnections(
      getConnectedInputKeys().filter((key) => key !== 'value'),
    )
    return type === 'generic'
      ? []
      : [{ key: 'output', type, list, settings, label: 'Value' }]
  },
}
