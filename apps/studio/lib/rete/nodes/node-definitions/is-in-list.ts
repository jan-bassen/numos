import type { NodeDefinition2 } from '@/types/nodes.types'
import type { IsInListNode } from '@repo/engine/src/nodes/is-in-list/interface'

export const isInListDefinition: NodeDefinition2<IsInListNode> = {
  type: 'is-in-list',
  category: 'data',
  title: 'Is in List',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description: 'This node allows you to check if a value is in a list.',
    link: '#list-length',
    example: '(List: [1, 2, 3], Value: 2) = true',
  },
  inputs: ({ getInfoFromInputConnections }) => {
    const { type, settings } = getInfoFromInputConnections(['list', 'value'])
    return [
      {
        key: 'list',
        type,
        list: true,
        label: 'List',
        settings,
        hideControl: true,
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
        key: 'value',
        type,
        settings,
        label: 'Value',
        hideControl: true,
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
  outputs: [{ key: 'output', type: 'boolean', label: 'Is in List' }],
}
