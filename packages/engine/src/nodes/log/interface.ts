import type { NodeInterface } from '@repo/engine/types/node-types.ts'
import type { ValueType } from '@repo/engine/types/value-types.ts'

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
