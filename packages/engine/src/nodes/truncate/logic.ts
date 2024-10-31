import type { NodeLogic } from '@repo/engine/types/node-types'
import type { TruncateNode } from '@repo/engine/nodes/truncate/interface'

export const truncateLogic: NodeLogic<TruncateNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const text = await getInputValue('text')
      const length = await getInputValue('length')
      return {
        type: 'string',
        format: 'single',
        value: text.value.slice(0, length.value),
      }
    },
  },
}
