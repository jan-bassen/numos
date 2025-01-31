import type { NodeLogic } from '@repo/shared/types/node-types'
import type { DatetimeInputNode } from '@repo/shared/engine/nodes/datetime-input/interface'

export const datetimeInputLogic: NodeLogic<DatetimeInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('datetime')
    },
  },
}
