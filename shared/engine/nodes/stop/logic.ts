import type { NodeLogic } from '@repo/shared/types/node-types'
import type { StopNode } from '@repo/shared/engine/nodes/stop/interface'

export const stopLogic: NodeLogic<StopNode> = {
  execution: async () => {
    return {
      log: { message: 'Action stopped explicitly' },
    }
  },
}
