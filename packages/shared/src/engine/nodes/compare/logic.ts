import type { NodeLogic } from '@repo/shared/types/node-types'
import type { CompareNode } from '@repo/shared/engine/nodes/compare/interface'
import { NodeError } from '@repo/shared/errors/node-error'
import { isEqual } from 'lodash'

export const compareLogic: NodeLogic<CompareNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const value1 = await getInputValue('value1')
      const value2 = await getInputValue('value2')
      const mode = getControlValue('mode').value

      if (value1.type !== value2.type) {
        throw new NodeError('Values must be of the same type', {
          component: {
            key: 'value1',
            type: 'input',
          },
        })
      }

      if (value1.format !== value2.format) {
        throw new NodeError(
          'Values must be either both arrays or both single values',
          {
            component: {
              key: 'value1',
              type: 'input',
            },
          },
        )
      }

      if (value1.format === 'array' && value2.format === 'array') {
        switch (mode) {
          case 'eq':
            return {
              type: 'boolean',
              format: 'single',
              value: isEqual(value1.value, value2.value),
            }
          case 'ne':
            return {
              type: 'boolean',
              format: 'single',
              value: !isEqual(value1.value, value2.value),
            }
          case 'same-length':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value.length === value2.value.length,
            }
          case 'different-length':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value.length !== value2.value.length,
            }
          default:
            throw new NodeError('Invalid mode', {
              component: {
                key: 'mode',
                type: 'control',
              },
            })
        }
      }

      if (value1.type === 'number' || value1.type === 'datetime') {
        switch (mode) {
          case 'eq':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value === value2.value,
            }
          case 'ne':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value !== value2.value,
            }
          case 'lt':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value < value2.value,
            }
          case 'gt':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value > value2.value,
            }
          case 'le':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value <= value2.value,
            }
          case 'ge':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value >= value2.value,
            }
          default:
            throw new NodeError('Invalid mode', {
              component: {
                key: 'mode',
                type: 'control',
              },
            })
        }
      }

      if (
        value1.type === 'weather' &&
        value2.type === 'weather' &&
        value1.format === 'single' &&
        value2.format === 'single'
      ) {
        switch (mode) {
          case 'eq':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value === value2.value,
            }
          case 'ne':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value !== value2.value,
            }
          case 'sc':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value.charAt(0) === value2.value.charAt(0),
            }
          case 'dc':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value.charAt(0) !== value2.value.charAt(0),
            }
          default:
            throw new NodeError('Invalid mode', {
              component: {
                key: 'mode',
                type: 'control',
              },
            })
        }
      }

      if (
        value1.type === 'string' &&
        value2.type === 'string' &&
        value1.format === 'single' &&
        value2.format === 'single'
      ) {
        switch (mode) {
          case 'eq':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value === value2.value,
            }
          case 'ne':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value !== value2.value,
            }
          case 'contains':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value.includes(value2.value),
            }
          case 'not-contains':
            return {
              type: 'boolean',
              format: 'single',
              value: !value1.value.includes(value2.value),
            }
          case 'starts':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value.startsWith(value2.value),
            }
          case 'ends':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value.endsWith(value2.value),
            }
          case 'same-length':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value.length === value2.value.length,
            }
          case 'different-length':
            return {
              type: 'boolean',
              format: 'single',
              value: value1.value.length !== value2.value.length,
            }
          default:
            throw new NodeError('Invalid mode', {
              component: {
                key: 'mode',
                type: 'control',
              },
            })
        }
      }

      switch (mode) {
        case 'eq':
          return {
            type: 'boolean',
            format: 'single',
            value: value1.value === value2.value,
          }
        case 'ne':
          return {
            type: 'boolean',
            format: 'single',
            value: value1.value !== value2.value,
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
