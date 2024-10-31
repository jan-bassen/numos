import type { NodeLogic } from '@repo/engine/types/node-types'
import type { TextCombineNode } from '@repo/engine/nodes/text-combine/interface'

export const textCombineLogic: NodeLogic<TextCombineNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const part1 = await getInputValue('part1')
      const part2 = await getInputValue('part2')
      const separator = getControlValue('separator')
      return {
        type: 'string',
        format: 'single',
        value: `${part1.value}${separator.value}${part2.value}`,
      }
    },
  },
}
