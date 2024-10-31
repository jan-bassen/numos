import type { NodeLogic } from '@repo/engine/types/node-types'
import type { SplitColorNode } from '@repo/engine/nodes/split-color/interface'

export const splitColorLogic: NodeLogic<SplitColorNode> = {
  data: {
    red: async ({ getInputValue }) => {
      const color = await getInputValue('color')
      return { type: 'number', format: 'single', value: color.value.r }
    },
    green: async ({ getInputValue }) => {
      const color = await getInputValue('color')
      return { type: 'number', format: 'single', value: color.value.g }
    },
    blue: async ({ getInputValue }) => {
      const color = await getInputValue('color')
      return { type: 'number', format: 'single', value: color.value.b }
    },
    alpha: async ({ getInputValue }) => {
      const color = await getInputValue('color')
      return { type: 'number', format: 'single', value: color.value.a }
    },
  },
}
