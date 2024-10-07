import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { LengthNode } from './interface.ts'

export const lengthLogic: NodeLogic<LengthNode> = {
  data: {
    output: ({ getInputValue }) => {
      const text = getInputValue('text').value
      return {
        type: 'number',
        format: 'single',
        value: text.length,
      }
    },
  },
}
