import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ClampNode } from '@repo/shared/engine/nodes/clamp/interface'
import { Decimal } from 'decimal.js'
export const clampLogic: NodeLogic<ClampNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const number = await getInputValue('number')
      const dec = new Decimal(number.value)
      const min = await getInputValue('min')
      const max = await getInputValue('max')
      return {
        type: 'number',
        format: 'single',
        value: dec.clamp(min.value, max.value).toNumber(),
      }
    },
  },
}
