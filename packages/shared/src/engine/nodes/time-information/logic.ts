import type { NodeLogic } from '@repo/shared/types/node-types'
import type { TimeInformationNode } from '@repo/shared/engine/nodes/time-information/interface'
import { DateTime } from 'luxon'

export const timeInformationLogic: NodeLogic<TimeInformationNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const timestamp = await getInputValue('time')
      const time = DateTime.fromMillis(timestamp.value)
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
        case 'day-of-month':
          value = time.day
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
