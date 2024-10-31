import type { NodeLogic } from '@repo/engine/types/node-types'
import type { CancelNode } from '@repo/engine/nodes/cancel/interface'

export const cancelLogic: NodeLogic<CancelNode> = {
  execution: async ({ revert }) => {
    revert()
    return { log: { message: 'Action cancelled and reverted' } }
  },
}
