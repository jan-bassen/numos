import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ListAddNode } from '@repo/shared/engine/nodes/list-add/interface'
import { NodeError } from '@repo/shared/errors/node-error'
import type {
  RawSingleValue,
  Value,
  ValueType,
} from '@repo/shared/types/values'

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
