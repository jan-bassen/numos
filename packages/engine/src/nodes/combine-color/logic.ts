import type { NodeLogic } from '@repo/engine/types/node-types'
import type { CombineColorNode } from '@repo/engine/nodes/combine-color/interface'

export const combineColorLogic: NodeLogic<CombineColorNode> = {
  data: {
    color: async ({ getInputValue }) => {
      const r = await getInputValue('red')
      const g = await getInputValue('green')
      const b = await getInputValue('blue')
      const a = await getInputValue('alpha')
      return {
        type: 'color',
        format: 'single',
        value: { r: r.value, g: g.value, b: b.value, a: a.value },
      }
    },
  },
}
