import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { NowNode } from '@repo/engine/nodes/now/interface'

export const nowDefinition: SpecificNodeDefinition<NowNode> = {
  type: 'now',
  category: 'data',
  title: 'Now',
  nodeInfo: {
    description:
      'This node outputs the current time. This will be the time of exection.',
    link: '#',
  },
  outputs: [{ key: 'output', type: 'datetime', label: 'Output' }],
}
