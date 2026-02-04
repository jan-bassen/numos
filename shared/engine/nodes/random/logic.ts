import type { NodeLogic } from '@repo/shared/types/node-types'
import type { RandomNode } from '@repo/shared/engine/nodes/random/interface'
import { Decimal } from 'decimal.js'

export const randomLogic: NodeLogic<RandomNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const min = await getInputValue('min')
      const max = await getInputValue('max')
      return {
        type: 'number',
        format: 'single',
        value: new Decimal(
          Math.random() * (max.value - min.value) + min.value,
        ).toNumber(),
      }
    },
  },
}
