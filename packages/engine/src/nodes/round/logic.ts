import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { RoundNode } from './interface.ts'
import { Decimal } from 'decimal.js'

export const roundLogic: NodeLogic<RoundNode> = {
  data: {
    output: ({ getInputValue }) => {
      const number = new Decimal(getInputValue('number').value)
      const precision = new Decimal(getInputValue('precision').value)
        .toDecimalPlaces(0)
        .toNumber()
      return {
        type: 'number',
        format: 'single',
        value: number.toDecimalPlaces(precision).toNumber(),
      }
    },
  },
}
