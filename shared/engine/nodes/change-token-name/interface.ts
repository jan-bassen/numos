import type { NodeInterface } from '@repo/shared/types/node-types'

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
