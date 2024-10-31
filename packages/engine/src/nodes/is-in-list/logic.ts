import type { NodeLogic } from '@repo/engine/types/node-types'
import type { IsInListNode } from '@repo/engine/nodes/is-in-list/interface'
import { NodeError } from '@repo/engine/errors/node-error'
import type { RawSingleValue } from '@repo/engine/types/value-types'

export const IsInListLogic: NodeLogic<IsInListNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const list = await getInputValue('list')
      const value = await getInputValue('value')
      if (list.type !== value.type) {
        throw new NodeError('Type mismatch', {
          component: {
            key: 'value',
            type: 'input',
          },
        })
      }
      const array = list.value as RawSingleValue[]
      return {
        type: 'boolean',
        format: 'single',
        value: array.includes(value.value),
      }
    },
  },
}
