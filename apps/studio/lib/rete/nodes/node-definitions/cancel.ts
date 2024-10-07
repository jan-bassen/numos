import type { NodeDefinition2 } from '@/types/nodes.types'
import type { CancelNode } from '@repo/engine/src/nodes/cancel/interface'

export const cancelDefinition: NodeDefinition2<CancelNode> = {
  type: 'cancel',
  category: 'exec',
  title: 'Cancel',
  nodeInfo: {
    description:
      "This node cancels the execution of the action and reverts any changes to it's initial state.",
    link: '#',
  },
}
