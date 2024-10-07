import type {
  NodeComponentType,
  NodeInterface,
} from '@repo/engine/types/node-types.ts'

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
    parameter: NodeComponentType
  }
}
