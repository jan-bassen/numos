import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { TimeInformationNode } from './interface.ts'
import { DateTime } from 'luxon'

export const timeInformationLogic: NodeLogic<TimeInformationNode> = {
  data: {
    output: ({ getInputValue, getControlValue }) => {
      const time = DateTime.fromMillis(getInputValue('time').value)
      const unit = getControlValue('unit').value
      let value: number
      switch (unit) {
        case 'second':
          value = time.second
          break
        case 'minute':
          value = time.minute
          break
        case 'hour':
          value = time.hour
          break
        case 'day':
          value = time.weekday
          break
        case 'week':
          value = time.weekNumber
          break
        case 'month':
          value = time.month
          break
        case 'year':
          value = time.year
          break
        default:
          throw new Error(`Unknown unit ${unit}`)
      }
      return { type: 'number', format: 'single', value }
    },
  },
}
