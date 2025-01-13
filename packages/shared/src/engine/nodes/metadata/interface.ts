import type { NodeInterface } from '@repo/shared/types/node-types'

export interface MetadataNode extends NodeInterface<'data'> {
  type: 'metadata'
  category: 'data'
  outputs: {
    id: {
      type: 'number'
      list: false
    }
    name: {
      type: 'string'
      list: false
    }
    description: {
      type: 'string'
      list: false
    }
  }
}
