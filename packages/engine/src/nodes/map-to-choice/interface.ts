import type {
  SocketInterface,
  NodeInterface,
} from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/engine/types/value-types'

export interface MapToChoiceNode extends NodeInterface<'data'> {
  type: 'map-to-choice'
  category: 'data'
  inputs: {
    value: {
      type: 'enum'
      list: false
    }
    [key: string]: {
      type: ValueType
      list: boolean
    }
  }
  outputs: {
    output: {
      type: ValueType
      list: boolean
    }
  }
}
