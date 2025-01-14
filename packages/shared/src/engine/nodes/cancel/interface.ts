import type { NodeInterface } from '@repo/shared/types/node-types'

export interface CancelNode extends NodeInterface<'exec'> {
  type: 'cancel'
  category: 'exec'
  forwards: undefined
}
