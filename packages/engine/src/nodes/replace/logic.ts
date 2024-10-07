import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ReplaceNode } from './interface.ts'

export const replaceLogic: NodeLogic<ReplaceNode> = {
  data: {
    output: ({ getInputValue }) => {
      const text = getInputValue('text').value
      const search = getInputValue('search').value
      const replace = getInputValue('replace').value
      return {
        type: 'string',
        format: 'single',
        value: text.replace(search, replace),
      }
    },
  },
}
