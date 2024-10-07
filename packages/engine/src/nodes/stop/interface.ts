import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface StopNode extends NodeInterface<'exec'> {
  type: 'stop'
  category: 'exec'
  forwards: undefined
}
