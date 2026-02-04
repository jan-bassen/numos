import type { NodeInterface } from '@repo/shared/types/node-types'
import type { ValueType } from '@repo/shared/types/values'

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
