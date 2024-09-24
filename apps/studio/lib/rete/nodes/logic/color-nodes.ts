import type { NodeLogicDefinitions } from '@/types/nodes.types'
import type { ColorNodeType } from '../definitions/color-nodes'
import { GraphError } from '@/lib/errors'
import type { Color } from '@/types/database.types'
import { isValidValueType } from '@/components/datatypes/schemas'

export const colorNodesLogic: NodeLogicDefinitions<ColorNodeType> = {
  'split-color': {
    simulate: {
      outputs: {
        r: ({ inputs, node }) => {
          const color = inputs?.color.value as Color
          if (!color || !isValidValueType('color', false, color)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.color.id,
            })
          }
          return { type: 'number', list: false, value: color.r }
        },
        g: ({ inputs, node }) => {
          const color = inputs?.color.value as Color
          if (!color || !isValidValueType('color', false, color)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.color.id,
            })
          }
          return { type: 'number', list: false, value: color.g }
        },
        b: ({ inputs, node }) => {
          const color = inputs?.color.value as Color
          if (!color || !isValidValueType('color', false, color)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.color.id,
            })
          }
          return { type: 'number', list: false, value: color.b }
        },
        a: ({ inputs, node }) => {
          const color = inputs?.color.value as Color
          if (!color || !isValidValueType('color', false, color)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.color.id,
            })
          }
          return { type: 'number', list: false, value: color.a }
        },
      },
    },
  },
  'combine-color': {
    simulate: {
      outputs: {
        color: ({ inputs, node }) => {
          const red = inputs?.red.value as number
          const green = inputs?.green.value as number
          const blue = inputs?.blue.value as number
          const alpha = inputs?.alpha.value as number
          if (!red || !isValidValueType('number', false, red)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.red.id,
            })
          }
          if (!green || !isValidValueType('number', false, green)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.green.id,
            })
          }
          if (!blue || !isValidValueType('number', false, blue)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.blue.id,
            })
          }
          return {
            type: 'color',
            list: false,
            value: { r: red, g: green, b: blue, a: alpha || 1 },
          }
        },
      },
    },
  },
}
