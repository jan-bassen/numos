import type { NodeInterface } from '@repo/shared/types/node-types'
import type { ValueType } from '@repo/shared/types/values'

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
