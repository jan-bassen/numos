import type {
  NodeComponentType,
  NodeInterface,
} from '@repo/engine/types/node-types.ts'
import type { ValueType } from '@repo/engine/types/value-types.ts'

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
    output: NodeComponentType
  }
}
