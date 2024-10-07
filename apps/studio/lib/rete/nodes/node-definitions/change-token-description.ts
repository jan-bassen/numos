import type { NodeDefinition2 } from '@/types/nodes.types'
import type { ChangeTokenDescriptionNode } from '@repo/engine/src/nodes/change-token-description/interface'

export const changeTokenDescriptionDefinition: NodeDefinition2<ChangeTokenDescriptionNode> =
  {
    type: 'change-token-description',
    category: 'exec',
    title: 'Change Token Description',
    forwards: [{ key: 'exec', label: 'Execute' }],
    root: false,
    nodeInfo: {
      description:
        'With this node you can change the description of the token.',
      link: '#',
    },
    inputs: [{ key: 'description', type: 'string', label: 'Description' }],
  }
