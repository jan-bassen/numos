import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ListAddNode } from '@repo/shared/engine/nodes/list-add/interface'

export const listAddDefinition: SpecificNodeDefinition<ListAddNode> = {
  type: 'list-add',
  category: 'data',
  title: 'Add to List',
  nodeInfo: {
    description: 'This node allows you to add a value to a list.',
    link: '#',
  },
  inputs: ({ getInfoFromInputConnections }) => {
    const { type, restrictions } =
      getInfoFromInputConnections(['list', 'value']) || {}
    return [
      {
        key: 'list',
        type,
        restrictions,
        list: true,
        label: 'List',
        hideControl: true,
        onConnect: (node) => {
          node.updateOutputs()
          node.updateInputs()
        },
        onDisconnect: (node) => {
          node.updateOutputs()
          node.updateInputs()
        },
      },
      {
        key: 'value',
        type,
        restrictions,
        label: 'Value',
        hideControl: true,
        onConnect: (node) => {
          node.updateOutputs()
          node.updateInputs()
        },
        onDisconnect: (node) => {
          node.updateOutputs()
          node.updateInputs()
        },
      },
    ]
  },
  controls: [
    {
      key: 'position',
      type: 'enum',
      label: 'Position',
      default: { value: 'start', type: 'enum', format: 'single' },
      restrictions: {
        options: [
          { value: 'start', label: 'Start' },
          { value: 'end', label: 'End' },
        ],
      },
    },
  ],
  outputs: ({ getInfoFromInputConnections }) => {
    const { type } = getInfoFromInputConnections(['list', 'value']) || {}
    return [{ key: 'output', type, list: true, label: 'List' }]
  },
}
