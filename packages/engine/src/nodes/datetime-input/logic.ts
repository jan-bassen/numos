import type { NodeLogic } from '@repo/engine/types/node-types'
import type { DatetimeInputNode } from '@repo/engine/nodes/datetime-input/interface'

export const datetimeInputLogic: NodeLogic<DatetimeInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('datetime')
    },
  },
}
