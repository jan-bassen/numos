import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ListAddNode } from '@repo/engine/nodes/list-add/interface'
import { NodeError } from '@repo/engine/errors/node-error'
import type {
  RawSingleValue,
  Value,
  ValueType,
} from '@repo/engine/types/value-types'

export const listAddLogic: NodeLogic<ListAddNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const list = await getInputValue('list')
      const value = await getInputValue('value')
      const position = getControlValue('position').value
      if (list.type !== value.type) {
        throw new NodeError('Type mismatch', {
          component: {
            key: 'value',
            type: 'input',
          },
        })
      }
      let newList: RawSingleValue[]
      switch (position) {
        case 'start':
          newList = [value.value, ...list.value]
          break
        case 'end':
          newList = [...list.value, value.value]
          break
        default:
          throw new NodeError('Invalid position', {
            component: {
              key: 'position',
              type: 'control',
            },
          })
      }
      return {
        type: list.type,
        format: 'array',
        value: newList,
      } as Value<ValueType, 'array', false>
    },
  },
}
