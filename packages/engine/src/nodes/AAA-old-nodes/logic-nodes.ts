import {
  DataNodeDefinitions,
  ExecNodeDefinitions,
  HybridNodeDefinitions,
  type NodeLogicDefinitions,
} from '@/types/nodes.types'
import type { LogicNodeType } from '../definitions/logic-nodes'
import { GraphError } from '@/lib/errors'
import type { WeatherCode } from '@/types/database.types'
import { isEqual } from 'lodash'

export const logicNodesLogic: NodeLogicDefinitions<LogicNodeType> = {
  logic: {
    simulate: {
      outputs: {
        output: ({ inputs, controls, node }) => {
          const mode = controls?.mode.value
          const a = inputs?.boolean1.value as boolean
          const b = inputs?.boolean2.value as boolean
          switch (mode) {
            case 'and':
              return { type: 'boolean', list: false, value: a && b }
            case 'or':
              return { type: 'boolean', list: false, value: a || b }
            case 'not':
              return { type: 'boolean', list: false, value: !a }
            case 'xor':
              return { type: 'boolean', list: false, value: a !== b }
            case 'nand':
              return { type: 'boolean', list: false, value: !(a && b) }
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
  compare: {
    simulate: {
      outputs: {
        output: ({ controls, inputs, node }) => {
          if (inputs?.value1.type !== inputs?.value2.type) {
            throw new GraphError('Values must be of the same type', node.id, {
              type: 'input',
              id: node.inputs.value1.key,
            })
          }
          const type = inputs?.value1.type
          const list = inputs?.value1.list || false
          const mode = controls?.mode.value
          if (list) {
            const list1 = inputs?.value1.value as Array<any>
            const list2 = inputs?.value2.value as Array<any>
            switch (mode) {
              case 'eq':
                return {
                  type: 'boolean',
                  list: false,
                  value: isEqual(list1, list2),
                }
              case 'ne':
                return {
                  type: 'boolean',
                  list: false,
                  value: !isEqual(list1, list2),
                }
              case 'same-length':
                return {
                  type: 'boolean',
                  list: false,
                  value: list1.length === list2.length,
                }
              case 'different-length':
                return {
                  type: 'boolean',
                  list: false,
                  value: list1.length !== list2.length,
                }
              default:
                throw new GraphError(
                  `Unknown list compare mode ${mode}`,
                  node.id,
                  {
                    type: 'control',
                    id: node.controls.mode.key,
                  },
                )
            }
          }
          switch (type) {
            case 'number': {
              const number1 = inputs?.value1.value as number
              const number2 = inputs?.value2.value as number
              switch (mode) {
                case 'eq':
                  return {
                    type: 'boolean',
                    list: false,
                    value: number1 === number2,
                  }
                case 'ne':
                  return {
                    type: 'boolean',
                    list: false,
                    value: number1 !== number2,
                  }
                case 'lt':
                  return {
                    type: 'boolean',
                    list: false,
                    value: number1 < number2,
                  }
                case 'le':
                  return {
                    type: 'boolean',
                    list: false,
                    value: number1 <= number2,
                  }
                case 'gt':
                  return {
                    type: 'boolean',
                    list: false,
                    value: number1 > number2,
                  }
                case 'ge':
                  return {
                    type: 'boolean',
                    list: false,
                    value: number1 >= number2,
                  }
                default:
                  throw new GraphError(`Unknown mode ${mode}`, node.id, {
                    type: 'control',
                    id: node.controls.mode.key,
                  })
              }
            }
            case 'datetime': {
              const date1 = inputs?.value1?.value as number
              const date2 = inputs?.value2?.value as number
              switch (mode) {
                case 'eq':
                  return {
                    type: 'boolean',
                    list: false,
                    value: date1 === date2,
                  }
                case 'ne':
                  return {
                    type: 'boolean',
                    list: false,
                    value: date1 !== date2,
                  }
                case 'lt':
                  return { type: 'boolean', list: false, value: date1 < date2 }
                case 'le':
                  return { type: 'boolean', list: false, value: date1 <= date2 }
                case 'gt':
                  return { type: 'boolean', list: false, value: date1 > date2 }
                case 'ge':
                  return { type: 'boolean', list: false, value: date1 >= date2 }
                default:
                  throw new GraphError(`Unknown mode ${mode}`, node.id, {
                    type: 'control',
                    id: node.controls.mode.key,
                  })
              }
            }
            case 'weather': {
              const weather1 = inputs?.value1?.value as WeatherCode
              const weather2 = inputs?.value2?.value as WeatherCode
              switch (mode) {
                case 'eq':
                  return {
                    type: 'boolean',
                    list: false,
                    value: weather1 === weather2,
                  }
                case 'ne':
                  return {
                    type: 'boolean',
                    list: false,
                    value: weather1 !== weather2,
                  }
                case 'sc':
                  return {
                    type: 'boolean',
                    list: false,
                    value: weather1.charAt(0) === weather2.charAt(0),
                  }
                case 'dc':
                  return {
                    type: 'boolean',
                    list: false,
                    value: weather1.charAt(0) !== weather2.charAt(0),
                  }
                default:
                  throw new GraphError(`Unknown mode ${mode}`, node.id, {
                    type: 'control',
                    id: node.controls.mode.key,
                  })
              }
            }
            case 'string': {
              const string1 = inputs?.value1?.value as string
              const string2 = inputs?.value2?.value as string
              switch (mode) {
                case 'eq':
                  return {
                    type: 'boolean',
                    list: false,
                    value: string1 === string2,
                  }
                case 'ne':
                  return {
                    type: 'boolean',
                    list: false,
                    value: string1 !== string2,
                  }
                case 'starts':
                  return {
                    type: 'boolean',
                    list: false,
                    value: string1.startsWith(string2),
                  }
                case 'ends':
                  return {
                    type: 'boolean',
                    list: false,
                    value: string1.endsWith(string2),
                  }
                case 'contains':
                  return {
                    type: 'boolean',
                    list: false,
                    value: string1.includes(string2),
                  }
                case 'not-contains':
                  return {
                    type: 'boolean',
                    list: false,
                    value: !string1.includes(string2),
                  }
                case 'same-length':
                  return {
                    type: 'boolean',
                    list: false,
                    value: string1.length === string2.length,
                  }
                case 'different-length':
                  return {
                    type: 'boolean',
                    list: false,
                    value: string1.length !== string2.length,
                  }
                default:
                  throw new GraphError(`Unknown mode ${mode}`, node.id, {
                    type: 'control',
                    id: node.controls.mode.key,
                  })
              }
            }
            default: {
              const value1 = inputs?.value1.value
              const value2 = inputs?.value2.value
              switch (mode) {
                case 'eq':
                  return {
                    type: 'boolean',
                    list: false,
                    value: value1 === value2,
                  }
                case 'ne':
                  return {
                    type: 'boolean',
                    list: false,
                    value: value1 !== value2,
                  }
                default:
                  throw new GraphError(`Unknown mode ${mode}`, node.id, {
                    type: 'control',
                    id: node.controls.mode.key,
                  })
              }
            }
          }
        },
      },
    },
  },
}
