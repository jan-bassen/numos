import type { NodeDefinition2 } from '@/types/nodes.types'
import type { LogNode } from '@repo/engine/src/nodes/log/interface'

export const logDefinition: NodeDefinition2<LogNode> = {
  type: 'log',
  category: 'exec',
  title: 'Log',
  forwards: [{ key: 'exec', label: 'Execute' }],
  nodeInfo: {
    description:
      'This node logs some text for testing. You can use this to debug your actions.',
    link: '#',
  },
  inputs: ({ getInfoFromInputConnection }) => {
    const { type, list, settings } = getInfoFromInputConnection('value')
    return [
      {
        key: 'value',
        type,
        list,
        settings,
        canBeList: true,
        label: 'Value',
        hideControl: true,
        onConnect: (node) => node.updateInputs(),
        onDisconnect: (node) => node.updateInputs(),
      },
    ]
  },
}
