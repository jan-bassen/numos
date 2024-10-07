import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { CombineColorNode } from './interface.ts'

export const combineColorLogic: NodeLogic<CombineColorNode> = {
  data: {
    color: ({ getInputValue }) => {
      const r = getInputValue('red').value
      const g = getInputValue('green').value
      const b = getInputValue('blue').value
      const a = getInputValue('alpha').value
      return { type: 'color', format: 'single', value: { r, g, b, a } }
    },
  },
}
