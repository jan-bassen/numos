import type { NodeLogic } from '@repo/engine/types/node-types'
import type { StopNode } from '@repo/engine/nodes/stop/interface'

export const stopLogic: NodeLogic<StopNode> = {
  execution: async () => {
    return {
      log: { message: 'Token name changed from undefined to undefined' },
    }
  },
}
