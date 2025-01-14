import type { NodeLogic } from '@repo/shared/types/node-types'
import type { CancelNode } from '@repo/shared/engine/nodes/cancel/interface'

export const cancelLogic: NodeLogic<CancelNode> = {
  execution: async ({ revert }) => {
    revert()
    return { log: { message: 'Action cancelled and reverted' } }
  },
}
