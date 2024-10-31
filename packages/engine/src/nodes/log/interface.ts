import type { NodeInterface } from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/engine/types/value-types'

export interface LogNode extends NodeInterface<'exec'> {
  type: 'log'
  category: 'exec'
  forwards: ['exec']
  inputs: {
    value: {
      list: boolean
      type: ValueType
    }
  }
}
