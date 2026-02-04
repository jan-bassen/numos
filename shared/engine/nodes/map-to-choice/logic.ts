/* import type { NodeLogic } from '@repo/engine/types/node-types'
import type { MapToChoiceNode } from '@repo/engine/nodes/map-to-choice/interface'

export const mapToChoiceLogic: NodeLogic<MapToChoiceNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const value = await getInputValue('value')
      if (value.value === 'value')
        throw new Error('Value is a reserved keyword')
      return await getInputValue(value.value)
    },
  },
}
 */
