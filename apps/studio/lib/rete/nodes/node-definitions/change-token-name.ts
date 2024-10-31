import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ChangeTokenNameNode } from '@repo/engine/nodes/change-token-name/interface'

export const changeTokenNameDefinition: SpecificNodeDefinition<ChangeTokenNameNode> =
  {
    type: 'change-token-name',
    category: 'exec',
    title: 'Change Token Name',
    forwards: [{ key: 'exec', label: 'Execute' }],
    root: false,
    nodeInfo: {
      description: 'With this node you can change the name of the token.',
      link: '#',
    },
    inputs: [{ key: 'name', type: 'string', label: 'Name' }],
  }
