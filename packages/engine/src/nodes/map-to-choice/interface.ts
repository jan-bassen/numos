import type {
  NodeComponentType,
  NodeInterface,
} from '@repo/engine/types/node-types.ts'

export interface MapToChoiceNode extends NodeInterface<'data'> {
  type: 'map-to-choice'
  category: 'data'
  inputs: {
    value: {
      type: 'enum'
      list: false
    }
    [key: string]: NodeComponentType
  }
  outputs: {
    output: NodeComponentType
  }
}
