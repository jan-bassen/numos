import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { RandomNode } from './interface.ts'
import { Decimal } from 'decimal.js'

export const randomLogic: NodeLogic<RandomNode> = {
  data: {
    output: ({ getInputValue }) => {
      const min = getInputValue('min').value
      const max = getInputValue('max').value
      return {
        type: 'number',
        format: 'single',
        value: new Decimal(Math.random() * (max - min) + min).toNumber(),
      }
    },
  },
}
