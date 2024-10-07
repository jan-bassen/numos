import type { NodeDefinition2 } from '@/types/nodes.types'
import type { StopNode } from '@repo/engine/src/nodes/stop/interface'

export const stopDefinition: NodeDefinition2<StopNode> = {
  type: 'stop',
  category: 'exec',
  title: 'Stop',
  componentType: 'generic',
  nodeInfo: {
    description:
      'This node stops the execution of the action imperatively without (!) reverting any changes.',
    link: '#',
  },
}
