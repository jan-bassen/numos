import type { NodeLogicDefinitions } from '@/types/nodes.types'
import { GraphError } from '@/lib/errors'
import {
  type DataTypeValue,
  ValueDataType,
  type NotatedDataTypeValue,
  type NotatedListDataTypeValue,
} from '@/types/database.types'
import { isArray } from 'lodash'
import type { ListNodeType } from '../definitions/list-nodes'

export const listNodesLogic: NodeLogicDefinitions<ListNodeType> = {
  'list-append': {
    simulate: {
      outputs: {
        output: ({ node, inputs }) => {
          const list = inputs?.list
          const value = inputs?.value
          console.log(list, value)
          if (!list || !list.list) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.list.id,
            })
          }
          if (!value || value.list) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.value.id,
            })
          }
          return {
            type: list.type,
            list: true,
            value: [...list.value, value.value],
          } as NotatedListDataTypeValue
        },
      },
    },
  },
  'list-prepend': {
    simulate: {
      outputs: {
        output: ({ node, inputs }) => {
          const list = inputs?.list
          const value = inputs?.value
          console.log(list, value)
          if (!list || !list.list) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.list.id,
            })
          }
          if (!value || value.list) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.value.id,
            })
          }
          return {
            type: list.type,
            list: true,
            value: [value.value, ...list.value],
          } as NotatedListDataTypeValue
        },
      },
    },
  },
  'list-length': {
    simulate: {
      outputs: {
        output: ({ node, inputs }) => {
          const list = inputs?.list
          if (!list || !list.list) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.list.id,
            })
          }
          return { type: 'number', list: false, value: list.value.length }
        },
      },
    },
  },
  'is-in-list': {
    simulate: {
      outputs: {
        output: ({ inputs, node }) => {
          const list = inputs?.list
          const value = inputs?.value
          if (!list || !list.list) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.list.id,
            })
          }
          if (!value || value.list) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.value.id,
            })
          }
          if (list.type !== value.type) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.value.id,
            })
          }
          const array = list.value as Array<DataTypeValue>
          return {
            type: 'boolean',
            list: false,
            value: array.includes(value.value),
          }
        },
      },
    },
  },
}
