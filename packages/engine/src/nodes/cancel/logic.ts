import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { CancelNode } from './interface.ts'

export const cancelLogic: NodeLogic<CancelNode> = {
  execution: async ({ revert }) => {
    revert()
    return { log: { message: 'Action cancelled and reverted' } }
  },
}
