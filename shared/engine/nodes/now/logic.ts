import type { NodeLogic } from '@repo/shared/types/node-types'
import type { NowNode } from '@repo/shared/engine/nodes/now/interface'

export const nowLogic: NodeLogic<NowNode> = {
  data: {
    output: () => {
      return {
        type: 'datetime',
        format: 'single',
        value: new Date().getTime(),
      }
    },
  },
}
