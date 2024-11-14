import type { NodeInterface } from '@repo/engine/types/node-types'

export interface TimeInformationNode extends NodeInterface<'data'> {
  type: 'time-information'
  category: 'data'
  inputs: {
    time: {
      type: 'datetime'
      list: false
    }
  }
  controls: {
    unit: {
      type: 'enum'
      list: false
      options: [
        { value: 'second'; label: 'Second of the minute' },
        { value: 'minute'; label: 'Minute of the hour' },
        { value: 'hour'; label: 'Hour of the day' },
        { value: 'day'; label: 'Day of the week' },
        { value: 'day-of-month'; label: 'Day of the month' },
        { value: 'week'; label: 'Week of the year' },
        { value: 'month'; label: 'Month of the year' },
        { value: 'year'; label: 'Year' },
      ]
    }
  }
  outputs: {
    output: {
      type: 'number'
      list: false
    }
  }
}
