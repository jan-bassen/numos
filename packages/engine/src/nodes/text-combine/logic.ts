import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { TextCombineNode } from './interface.ts'

export const textCombineLogic: NodeLogic<TextCombineNode> = {
  data: {
    output: ({ getInputValue }) => {
      const part1 = getInputValue('part1').value
      const part2 = getInputValue('part2').value
      const separator = getInputValue('separator').value
      return {
        type: 'string',
        format: 'single',
        value: `${part1}${separator}${part2}`,
      }
    },
  },
}
