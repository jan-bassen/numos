import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ListLengthNode } from './interface.ts'

export const listLengthLogic: NodeLogic<ListLengthNode> = {
  data: {
    output: ({ getInputValue }) => {
      const list = getInputValue('list')
      return {
        type: 'number',
        format: 'single',
        value: list.value.length,
      }
    },
  },
}
