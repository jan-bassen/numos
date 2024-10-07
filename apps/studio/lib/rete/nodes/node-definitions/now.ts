import type { NodeDefinition2 } from '@/types/nodes.types'
import type { NowNode } from '@repo/engine/src/nodes/now/interface'

export const nowDefinition: NodeDefinition2<NowNode> = {
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
