import type { NodeLogic } from '@repo/engine/types/node-types'
import type { TimeDifferenceNode } from '@repo/engine/nodes/time-difference/interface'
import { DateTime } from 'luxon'

export const timeDifferenceLogic: NodeLogic<TimeDifferenceNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const time1 = await getInputValue('time1')
      const time2 = await getInputValue('time2')
      const start = DateTime.fromMillis(time1.value)
      const end = DateTime.fromMillis(time2.value)
      const diff = end.diff(start)
      const unit = getControlValue('unit').value
      let value: number
      switch (unit) {
        case 'seconds':
          value = diff.seconds
          break
        case 'minutes':
          value = diff.minutes
          break
        case 'hours':
          value = diff.hours
          break
        case 'days':
          value = diff.days
          break
        case 'weeks':
          value = diff.weeks
          break
        case 'months':
          value = diff.months
          break
        case 'years':
          value = diff.years
          break
        default:
          throw new Error(`Unknown unit ${unit}`)
      }
      return { type: 'number', format: 'single', value }
    },
  },
}
