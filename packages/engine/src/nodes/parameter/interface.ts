import type {
  SocketInterface,
  NodeInterface,
} from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/engine/types/value-types'

export interface ParameterNode extends NodeInterface<'data'> {
  type: 'parameter'
  category: 'data'
  controls: {
    parameter: {
      type: 'enum'
      list: false
    }
  }
  outputs: {
    parameter: {
      type: ValueType
      list: boolean
    }
  }
}
