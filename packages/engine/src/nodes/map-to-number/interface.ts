import type { NodeInterface } from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/shared/types/values'

export interface MapToNumberNode extends NodeInterface<'data'> {
  type: 'map-to-number'
  category: 'data'
  inputs: {
    number: {
      type: 'number'
      list: false
    }
    [key: string]: {
      type: ValueType
      list: false
    }
  }
  controls: {
    breakpoints: {
      type: 'number'
      list: true
    }
    mode: {
      type: 'enum'
      list: false
      options: ['up', 'down']
    }
  }
  outputs: {
    output: {
      type: ValueType
      list: boolean
    }
  }
}
