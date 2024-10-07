import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ListAddNode } from './interface.ts'
import { NodeError } from '@repo/engine/errors/node-error.ts'
import type {
  RawValue,
  Value,
  ValueType,
} from '@repo/engine/types/value-types.ts'

export const listAddLogic: NodeLogic<ListAddNode> = {
  data: {
    output: ({ getInputValue, getControlValue }) => {
      const list = getInputValue('list')
      const value = getInputValue('value')
      const position = getControlValue('position').value
      if (list.type !== value.type) {
        throw new NodeError('Type mismatch', {
          component: {
            key: 'value',
            type: 'input',
          },
        })
      }
      let newList: RawValue[]
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
