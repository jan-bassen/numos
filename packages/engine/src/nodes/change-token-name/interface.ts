import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface ChangeTokenNameNode extends NodeInterface<'exec'> {
  type: 'change-token-name'
  category: 'exec'
  forwards: ['exec']
  inputs: {
    name: {
      list: false
      type: 'string'
    }
  }
}
