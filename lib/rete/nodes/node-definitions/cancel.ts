import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { CancelNode } from '@repo/shared/engine/nodes/cancel/interface'

export const cancelDefinition: SpecificNodeDefinition<CancelNode> = {
  type: 'cancel',
  category: 'exec',
  title: 'Cancel',
  nodeInfo: {
    description:
      "This node cancels the execution of the action and reverts any changes to it's initial state.",
    link: '#',
  },
}
