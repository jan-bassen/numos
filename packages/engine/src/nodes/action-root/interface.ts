import type { NodeInterface } from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/engine/types/value-types'

export interface ActionRootNode extends NodeInterface<'hybrid', true> {
  type: 'action-root'
  category: 'hybrid'
  root: true
  outputs: {
    [key in string]: {
      type: ValueType
      list: boolean
    }
  }
  forwards: ['exec']
}
