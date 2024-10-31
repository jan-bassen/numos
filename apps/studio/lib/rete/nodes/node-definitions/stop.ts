import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { StopNode } from '@repo/engine/nodes/stop/interface'

export const stopDefinition: SpecificNodeDefinition<StopNode> = {
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
