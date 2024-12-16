import type { SpecificNodeDefinition } from '@/types/nodes.types'
import { NodeError } from '@repo/engine/errors/node-error'
import type { IsInListNode } from '@repo/engine/nodes/is-in-list/interface'

export const isInListDefinition: SpecificNodeDefinition<IsInListNode> = {
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
    const { type, restrictions } =
      getInfoFromInputConnections(['list', 'value']) || {}
    return [
      {
        key: 'list',
        type,
        list: true,
        label: 'List',
        restrictions,
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
        restrictions,
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
