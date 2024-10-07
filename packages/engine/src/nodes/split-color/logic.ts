import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { SplitColorNode } from './interface.ts'

export const splitColorLogic: NodeLogic<SplitColorNode> = {
  data: {
    red: ({ getInputValue }) => {
      const color = getInputValue('color').value
      return { type: 'number', format: 'single', value: color.r }
    },
    green: ({ getInputValue }) => {
      const color = getInputValue('color').value
      return { type: 'number', format: 'single', value: color.g }
    },
    blue: ({ getInputValue }) => {
      const color = getInputValue('color').value
      return { type: 'number', format: 'single', value: color.b }
    },
    alpha: ({ getInputValue }) => {
      const color = getInputValue('color').value
      return { type: 'number', format: 'single', value: color.a }
    },
  },
}
