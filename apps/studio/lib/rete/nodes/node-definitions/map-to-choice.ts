/* import type {
  SpecificNodeDefinition,
  DataSocketDefinition,
} from '@/types/nodes.types'
import type { MapToChoiceNode } from '@repo/engine/nodes/map-to-choice/interface'

export const mapToChoiceDefinition: SpecificNodeDefinition<MapToChoiceNode> = {
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
    const { restrictions } = getInfoFromInputConnection('value') || {}
    const {
      type,
      list,
      restrictions: inputRestrictions,
    } = getInfoFromInputConnections(
      getConnectedInputKeys().filter((key) => key !== 'value'),
    ) || {}

    // TODO: Make cleaner?
    const inputOptions =
      restrictions && 'options' in restrictions ? restrictions.options : []

    const optionsInputs: DataSocketDefinition<
      MapToChoiceNode,
      'inputs',
      string
    >[] =
      inputOptions?.map((option) => {
        return {
          key: option.value,
          type,
          list,
          restrictions: inputRestrictions,
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

    const valueInput: DataSocketDefinition<MapToChoiceNode, 'inputs', 'value'> =
      {
        key: 'value',
        type: 'enum',
        label: 'Choice Value',
        restrictions,
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
    const { type, list, restrictions } =
      getInfoFromInputConnections(
        getConnectedInputKeys().filter((key) => key !== 'value'),
      ) || {}
    return [{ key: 'output', type, list, restrictions, label: 'Value' }]
  },
}
 */
