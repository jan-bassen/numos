import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { DatetimeInputNode } from './interface.ts'

export const datetimeInputLogic: NodeLogic<DatetimeInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('datetime')
    },
  },
}
