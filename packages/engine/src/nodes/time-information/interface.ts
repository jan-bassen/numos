import type { NodeInterface } from '@repo/engine/types/node-types.ts'

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
        { value: 'second'; label: 'Second' },
        { value: 'minute'; label: 'Minute' },
        { value: 'hour'; label: 'Hour' },
        { value: 'day'; label: 'Day' },
        { value: 'week'; label: 'Week' },
        { value: 'month'; label: 'Month' },
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
