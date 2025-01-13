import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { SwitchNode } from '@repo/shared/engine/nodes/switch/interface'

export const switchDefinition: SpecificNodeDefinition<SwitchNode> = {
  type: 'switch',
  category: 'exec',
  title: 'Switch',
  forwards: [
    { type: 'exec', key: 'true', label: 'If true' },
    { type: 'exec', key: 'false', label: 'If false' },
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
