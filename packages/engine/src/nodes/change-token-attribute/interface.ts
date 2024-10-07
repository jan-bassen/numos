import type {
  NodeComponentType,
  NodeInterface,
} from '@repo/engine/types/node-types.ts'

export interface ChangeTokenAttributeNode extends NodeInterface<'exec'> {
  type: 'change-token-attribute'
  category: 'exec'
  controls: {
    attribute: {
      type: 'enum'
      list: false
      options: string[]
    }
    mode: {
      type: 'enum'
      list: false
      settings: {
        options: [
          { value: 'set'; label: 'Set' },
          { value: 'incr'; label: 'Incr' },
          { value: 'decr'; label: 'Decr' },
        ]
      }
    }
  }
  inputs: {
    value: NodeComponentType
  }
  forwards: ['exec']
}
