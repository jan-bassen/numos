import type { NodeLogic } from '@repo/shared/types/node-types'
import type { TimeDifferenceNode } from '@repo/shared/engine/nodes/time-difference/interface'
import { DateTime } from 'luxon'

export const timeDifferenceLogic: NodeLogic<TimeDifferenceNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const time1 = await getInputValue('time1')
      const time2 = await getInputValue('time2')
      const unit = getControlValue('unit').value as
        | 'seconds'
        | 'minutes'
        | 'hours'
        | 'days'
        | 'weeks'
        | 'months'
        | 'years'
      const start = DateTime.fromMillis(time1.value)
      const end = DateTime.fromMillis(time2.value)
      const diff = end.diff(start, unit)
      const value = Math.abs(diff[unit])
      return { type: 'number', format: 'single', value }
    },
  },
}
