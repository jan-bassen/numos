import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { TruncateNode } from './interface.ts'

export const truncateLogic: NodeLogic<TruncateNode> = {
  data: {
    output: ({ getInputValue }) => {
      const text = getInputValue('text').value
      const length = getInputValue('length').value
      return {
        type: 'string',
        format: 'single',
        value: text.slice(0, length),
      }
    },
  },
}
