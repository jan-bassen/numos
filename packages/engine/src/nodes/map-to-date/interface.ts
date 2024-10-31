import type {
  SocketInterface,
  NodeInterface,
} from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/engine/types/value-types'

export interface MapToDateNode extends NodeInterface<'data'> {
  type: 'map-to-date'
  category: 'data'
  inputs: {
    datetime: {
      type: 'datetime'
      list: false
    }
    [key: string]: {
      type: ValueType
      list: false
    }
  }
  controls: {
    breakpoints: {
      type: 'datetime'
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
