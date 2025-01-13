import type { NodeLogic } from '@repo/shared/types/node-types'
import type { RoundNode } from '@repo/shared/engine/nodes/round/interface'
import { Decimal } from 'decimal.js'

export const roundLogic: NodeLogic<RoundNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const number = await getInputValue('number')
      const precision = await getInputValue('precision')
      const decimalPlaces = new Decimal(precision.value)
        .toDecimalPlaces(0)
        .toNumber()

      const value = new Decimal(number.value)
        .toDecimalPlaces(decimalPlaces)
        .toNumber()

      return {
        type: 'number',
        format: 'single',
        value,
      }
    },
  },
}
