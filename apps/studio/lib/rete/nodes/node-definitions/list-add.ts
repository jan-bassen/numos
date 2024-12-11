import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ListAddNode } from '@repo/engine/nodes/list-add/interface'

export const listAddDefinition: SpecificNodeDefinition<ListAddNode> = {
  type: 'list-add',
  category: 'data',
  title: 'Add to List',
  nodeInfo: {
    description: 'This node allows you to add a value to a list.',
    link: '#',
  },
  inputs: ({ getInfoFromInputConnections }) => {
    const { type, settings } =
      getInfoFromInputConnections(['list', 'value']) || {}
    return [
      {
        key: 'list',
        type,
        settings,
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
        settings,
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
      settings: {
        default: { value: 'start', type: 'enum', format: 'single' },
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
