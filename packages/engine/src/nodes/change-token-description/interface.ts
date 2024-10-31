import type { NodeInterface } from '@repo/engine/types/node-types'

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
