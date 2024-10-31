import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ListLengthNode } from '@repo/engine/nodes/list-length/interface'

export const listLengthLogic: NodeLogic<ListLengthNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const list = await getInputValue('list')
      return {
        type: 'number',
        format: 'single',
        value: list.value.length,
      }
    },
  },
}
