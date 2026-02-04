import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { LogNode } from '@repo/shared/engine/nodes/log/interface'

export const logDefinition: SpecificNodeDefinition<LogNode> = {
  type: 'log',
  category: 'exec',
  title: 'Log',
  forwards: [{ type: 'exec', key: 'exec', label: 'Execute' }],
  nodeInfo: {
    description:
      'This node logs some text for testing. You can use this to debug your actions.',
    link: '#',
  },
  inputs: ({ getInfoFromInputConnection }) => {
    const { type, list, restrictions } =
      getInfoFromInputConnection('value') || {}
    return [
      {
        key: 'value',
        type,
        list,
        restrictions,
        canBeList: true,
        label: 'Value',
        hideControl: true,
        onConnect: (node) => node.updateInputs(),
        onDisconnect: (node) => node.updateInputs(),
      },
    ]
  },
}
