import type { NodeDefinition2 } from '@/types/nodes.types'
import type { ListLengthNode } from '@repo/engine/src/nodes/list-length/interface'

export const listLengthDefinition: NodeDefinition2<ListLengthNode> = {
  type: 'list-length',
  category: 'data',
  title: 'Length of List',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description: 'This node returns the number of items in a list.',
    link: '#list-length',
  },
  inputs: ({ getInfoFromInputConnection }) => {
    const { settings, type } = getInfoFromInputConnection('list')
    return [
      {
        key: 'list',
        type,
        settings,
        list: true,
        label: 'List',
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
  outputs: [{ key: 'output', type: 'number', label: 'Length' }],
}
