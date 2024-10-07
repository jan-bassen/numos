import type { NodeDefinition2 } from '@/types/nodes.types'
import type { DataSwitchNode } from '@repo/engine/src/nodes/data-switch/interface'

export const dataSwitchDefinition: NodeDefinition2<DataSwitchNode> = {
  type: 'data-switch',
  category: 'data',
  title: 'Map to Yes/No',
  nodeInfo: {
    description: 'This node allows you to switch between two data inputs.',
    link: '#data-switch',
  },
  inputs: ({ getInfoFromInputConnections }) => {
    const { type, settings, list } = getInfoFromInputConnections([
      'true',
      'false',
    ])
    return [
      {
        key: 'switch',
        type: 'boolean',
        label: 'Switch',
      },
      {
        key: 'true',
        type: type,
        list: list,
        label: 'If Yes',
        canBeList: true,
        settings,
        onConnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
        onDisconnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
      },
      {
        key: 'false',
        type: type,
        list: list,
        label: 'If No',
        canBeList: true,
        settings,
        onConnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
        onDisconnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
      },
    ]
  },
  outputs: ({ getInfoFromInputConnections }) => {
    const { type, list, settings } = getInfoFromInputConnections([
      'true',
      'false',
    ])
    return [{ key: 'output', type, list, label: 'Result', settings }]
  },
}
