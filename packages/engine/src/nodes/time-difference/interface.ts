import type { NodeInterface } from '@repo/engine/types/node-types'

export interface TimeDifferenceNode extends NodeInterface<'data'> {
  type: 'time-difference'
  category: 'data'
  inputs: {
    time1: {
      type: 'datetime'
      list: false
    }
    time2: {
      type: 'datetime'
      list: false
    }
  }
  controls: {
    unit: {
      type: 'enum'
      list: false
      options: [
        { value: 'seconds'; label: 'Seconds' },
        { value: 'minutes'; label: 'Minutes' },
        { value: 'hours'; label: 'Hours' },
        { value: 'days'; label: 'Days' },
        { value: 'weeks'; label: 'Weeks' },
        { value: 'months'; label: 'Months' },
        { value: 'years'; label: 'Years' },
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
