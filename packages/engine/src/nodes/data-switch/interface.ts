import type {
  NodeComponentType,
  NodeInterface,
} from '@repo/engine/types/node-types.ts'

export interface DataSwitchNode extends NodeInterface<'data'> {
  type: 'data-switch'
  category: 'data'
  inputs: {
    switch: {
      type: 'boolean'
      list: false
    }
    true: NodeComponentType
    false: NodeComponentType
  }
  outputs: {
    output: NodeComponentType
  }
}
