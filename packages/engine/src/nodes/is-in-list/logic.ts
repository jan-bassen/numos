import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { IsInListNode } from './interface.ts'
import { NodeError } from '@repo/engine/errors/node-error.ts'
import type { RawValue } from '@repo/engine/types/value-types.ts'

export const IsInListLogic: NodeLogic<IsInListNode> = {
  data: {
    output: ({ getInputValue }) => {
      const list = getInputValue('list')
      const value = getInputValue('value')
      if (list.type !== value.type) {
        throw new NodeError('Type mismatch', {
          component: {
            key: 'value',
            type: 'input',
          },
        })
      }
      const array = list.value as RawValue[]
      return {
        type: 'boolean',
        format: 'single',
        value: array.includes(value.value),
      }
    },
  },
}
