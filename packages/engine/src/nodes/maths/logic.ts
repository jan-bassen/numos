import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { MathsNode } from './interface.ts'
import { Decimal } from 'decimal.js'
import { NodeError } from '@repo/engine/errors/node-error.ts'

export const mathsLogic: NodeLogic<MathsNode> = {
  data: {
    output: ({ getInputValue, getControlValue }) => {
      const a = new Decimal(getInputValue('number1').value)
      const b = getInputValue('number2').value
      const mode = getControlValue('mode').value

      switch (mode) {
        case 'add':
          return {
            type: 'number',
            format: 'single',
            value: a.plus(b).toNumber(),
          }
        case 'subtract':
          return {
            type: 'number',
            format: 'single',
            value: a.minus(b).toNumber(),
          }
        case 'mul':
          return {
            type: 'number',
            format: 'single',
            value: a.times(b).toNumber(),
          }
        case 'div':
          return {
            type: 'number',
            format: 'single',
            value: a.div(b).toNumber(),
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
