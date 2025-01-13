import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ReplaceNode } from '@repo/shared/engine/nodes/replace/interface'

export const replaceLogic: NodeLogic<ReplaceNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const text = await getInputValue('text')
      const search = await getInputValue('search')
      const replace = await getInputValue('replace')
      return {
        type: 'string',
        format: 'single',
        value: text.value.replace(search.value, replace.value),
      }
    },
  },
}
