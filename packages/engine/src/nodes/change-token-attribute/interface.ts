import type { NodeInterface } from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/engine/types/value-types'

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
    value: {
      type: ValueType
      list: boolean
    }
  }
  forwards: ['exec']
}
