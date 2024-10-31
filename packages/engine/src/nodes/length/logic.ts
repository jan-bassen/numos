import type { NodeLogic } from '@repo/engine/types/node-types'
import type { LengthNode } from '@repo/engine/nodes/length/interface'

export const lengthLogic: NodeLogic<LengthNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const text = await getInputValue('text')
      return {
        type: 'number',
        format: 'single',
        value: text.value.length,
      }
    },
  },
}
