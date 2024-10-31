import type { NodeLogic } from '@repo/engine/types/node-types'
import type { MathsNode } from '@repo/engine/nodes/maths/interface'
import { Decimal } from 'decimal.js'
import { NodeError } from '@repo/engine/errors/node-error'

export const mathsLogic: NodeLogic<MathsNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const number1 = await getInputValue('number1')
      const a = new Decimal(number1.value)
      const b = await getInputValue('number2')
      const mode = getControlValue('mode').value

      switch (mode) {
        case 'add':
          return {
            type: 'number',
            format: 'single',
            value: a.plus(b.value).toNumber(),
          }
        case 'subtract':
          return {
            type: 'number',
            format: 'single',
            value: a.minus(b.value).toNumber(),
          }
        case 'mul':
          return {
            type: 'number',
            format: 'single',
            value: a.times(b.value).toNumber(),
          }
        case 'div':
          return {
            type: 'number',
            format: 'single',
            value: a.div(b.value).toNumber(),
          }
        default:
          throw new NodeError('Invalid mode', {
            component: {
              key: 'mode',
              type: 'control',
            },
          })
      }
    },
  },
}
