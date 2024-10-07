import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ClampNode } from './interface.ts'
import { Decimal } from 'decimal.js'

export const clampLogic: NodeLogic<ClampNode> = {
  data: {
    output: ({ getInputValue }) => {
      const number = new Decimal(getInputValue('number').value)
      const min = getInputValue('min').value
      const max = getInputValue('max').value
      return {
        type: 'number',
        format: 'single',
        value: number.clamp(min, max).toNumber(),
      }
    },
  },
}
