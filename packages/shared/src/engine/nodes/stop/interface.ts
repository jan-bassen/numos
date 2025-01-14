import type { NodeInterface } from '@repo/shared/types/node-types'

export interface StopNode extends NodeInterface<'exec'> {
  type: 'stop'
  category: 'exec'
  forwards: undefined
}
