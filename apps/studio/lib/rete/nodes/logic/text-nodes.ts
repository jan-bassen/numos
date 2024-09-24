import {
  DataNodeDefinitions,
  type NodeLogicDefinitions,
} from '@/types/nodes.types'
import type { TextNodeType } from '../definitions/text-nodes'
import { GraphError } from '@/lib/errors'
import { isValidValueType } from '@/components/datatypes/schemas'

export const textNodesLogic: NodeLogicDefinitions<TextNodeType> = {
  'text-combine': {
    simulate: {
      outputs: {
        output: ({ inputs, controls, node }) => {
          const separator = (controls?.separator.value as string) || ''
          const part1 = inputs?.part1.value as string
          const part2 = inputs?.part2.value as string
          return {
            type: 'string',
            list: false,
            value: part1 + separator + part2,
          }
        },
      },
    },
  },
  truncate: {
    simulate: {
      outputs: {
        output: ({ inputs, node }) => {
          const text = inputs?.text.value as string
          const length = inputs?.length.value as number
          if (!text || !isValidValueType('string', false, text)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.text.id,
            })
          }
          if (!length || !isValidValueType('number', false, length)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'control',
              id: node.inputs.length.id,
            })
          }
          return { type: 'string', list: false, value: text.slice(0, length) }
        },
      },
    },
  },
  replace: {
    simulate: {
      outputs: {
        output: ({ inputs, node }) => {
          const text = inputs?.text.value as string
          const search = inputs?.search.value as string
          const replace = inputs?.replace.value as string
          if (!text || !isValidValueType('string', false, text)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.text.id,
            })
          }
          if (!search || !isValidValueType('string', false, search)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'control',
              id: node.inputs.search.id,
            })
          }
          if (!replace || !isValidValueType('string', false, replace)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'control',
              id: node.inputs.replace.id,
            })
          }
          return {
            type: 'string',
            list: false,
            value: text.replace(search, replace),
          }
        },
      },
    },
  },
  length: {
    simulate: {
      outputs: {
        output: ({ inputs, node }) => {
          const text = inputs?.text.value as string
          if (!text || !isValidValueType('string', false, text)) {
            throw new GraphError('Invalid value', node.id, {
              type: 'input',
              id: node.inputs.text.id,
            })
          }
          return { type: 'number', list: false, value: text.length }
        },
      },
    },
  },
}
