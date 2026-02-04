import type { NodeLogic } from '@repo/shared/types/node-types'
import type { TruncateNode } from '@repo/shared/engine/nodes/truncate/interface'

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
