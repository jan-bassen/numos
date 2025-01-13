import type { NodeInterface } from '@repo/shared/types/node-types'

export interface ChangeTokenDescriptionNode extends NodeInterface<'exec'> {
  type: 'change-token-description'
  category: 'exec'
  forwards: ['exec']
  inputs: {
    description: {
      list: false
      type: 'string'
    }
  }
}
