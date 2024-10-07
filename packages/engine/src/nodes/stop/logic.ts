import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { StopNode } from './interface.ts'

export const stopLogic: NodeLogic<StopNode> = {
  execution: async () => {
    return {
      log: { message: 'Token name changed from undefined to undefined' },
    }
  },
}
