import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { NowNode } from './interface.ts'

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
