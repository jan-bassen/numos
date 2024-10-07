import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { TimeDifferenceNode } from './interface.ts'
import { DateTime } from 'luxon'

export const timeDifferenceLogic: NodeLogic<TimeDifferenceNode> = {
  data: {
    output: ({ getInputValue, getControlValue }) => {
      const time1 = DateTime.fromMillis(getInputValue('time1').value)
      const time2 = DateTime.fromMillis(getInputValue('time2').value)
      const diff = time2.diff(time1)
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
