import type { NodeDefinition2 } from '@/types/nodes.types'
import type { SwitchNode } from '@repo/engine/src/nodes/switch/interface'

export const switchDefinition: NodeDefinition2<SwitchNode> = {
  type: 'switch',
  category: 'exec',
  title: 'Switch',
  forwards: [
    { key: 'true', label: 'If true' },
    { key: 'false', label: 'If false' },
  ],
  nodeInfo: {
    description: 'This can switch between two execution paths.',
    link: '#',
  },
  inputs: [
    {
      key: 'switch',
      type: 'boolean',
      label: 'Switch',
    },
  ],
}
