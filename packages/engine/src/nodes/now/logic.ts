import type { NodeLogic } from '@repo/engine/types/node-types'
import type { NowNode } from '@repo/engine/nodes/now/interface'

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
