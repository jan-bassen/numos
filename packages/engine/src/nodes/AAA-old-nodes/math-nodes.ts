import {
  DataNodeDefinitions,
  type NodeLogicDefinitions,
} from '@/types/nodes.types'

import type { MathNodeType } from '../definitions/math-nodes'
import { GraphError } from '@/lib/errors'
import Decimal from 'decimal.js'
import { isValidValueType } from '@/components/datatypes/schemas'

export const mathNodesLogic: NodeLogicDefinitions<MathNodeType> = {
  maths: {
    simulate: {
      outputs: {
        output: ({ inputs, controls, node }) => {
          const mode = controls?.mode.value
          const number1 = inputs?.number1.value as number
          const number2 = inputs?.number2.value as number
          if (!number1 || !isValidValueType('number', false, number1)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.number1.id,
            })
          }
          if (!number2 || !isValidValueType('number', false, number2)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.number2.id,
            })
          }
          const a = new Decimal(number1)
          switch (mode) {
            case 'add':
              return {
                type: 'number',
                list: false,
                value: a.plus(number2).toNumber(),
              }
            case 'subtract':
              return {
                type: 'number',
                list: false,
                value: a.minus(number2).toNumber(),
              }
            case 'mul':
              return {
                type: 'number',
                list: false,
                value: a.times(number2).toNumber(),
              }
            case 'div':
              return {
                type: 'number',
                list: false,
                value: a.div(number2).toNumber(),
              }
            default:
              throw new GraphError(`Unknown mode ${mode}`, node.id, {
                type: 'control',
                id: node.controls.mode.key,
              })
          }
        },
      },
    },
  },
  round: {
    simulate: {
      outputs: {
        output: ({ inputs, node }) => {
          const number = inputs?.number.value as number
          const precision = inputs?.precision.value as number
          if (!number || !isValidValueType('number', false, number)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.number.id,
            })
          }
          if (!precision || !isValidValueType('number', false, precision)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'control',
              id: node.controls.precision.key,
            })
          }
          const num = new Decimal(number)
          const prec = new Decimal(precision).toDecimalPlaces(0).toNumber()
          const newNum = num.toDecimalPlaces(prec).toNumber()
          return { type: 'number', list: false, value: newNum }
        },
      },
    },
  },
  random: {
    simulate: {
      outputs: {
        output: ({ node, inputs }) => {
          const min = inputs.min.value as number
          if (!min || !isValidValueType('number', false, min)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'control',
              id: node.controls.min.key,
            })
          }
          const max = inputs.max.value as number
          if (!max || !isValidValueType('number', false, max)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'control',
              id: node.controls.max.key,
            })
          }
          const value = new Decimal(
            Math.random() * (max - min) + min,
          ).toNumber()
          return { type: 'number', list: false, value }
        },
      },
    },
  },
  clamp: {
    simulate: {
      outputs: {
        output: ({ inputs, node }) => {
          const number = inputs?.number.value as number
          const min = inputs?.min.value as number
          const max = inputs?.max.value as number
          if (!number || !isValidValueType('number', false, number)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.number.id,
            })
          }
          if (!min || !isValidValueType('number', false, min)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'control',
              id: node.controls.min.key,
            })
          }
          if (!max || !isValidValueType('number', false, max)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'control',
              id: node.controls.max.key,
            })
          }
          const num = new Decimal(number)
          return {
            type: 'number',
            list: false,
            value: num.clamp(min, max).toNumber(),
          }
        },
      },
    },
  },
}
