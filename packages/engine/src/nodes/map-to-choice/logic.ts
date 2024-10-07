import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { MapToChoiceNode } from './interface.ts'

export const mapToChoiceLogic: NodeLogic<MapToChoiceNode> = {
  data: {
    output: ({ getInputValue }) => {
      const value = getInputValue('value').value
      if (value === 'value') throw new Error('Value is a reserved keyword')
      return getInputValue(value)
    },
  },
}
