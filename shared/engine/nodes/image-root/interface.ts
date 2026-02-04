import type { NodeInterface } from '@repo/shared/types/node-types'

export interface ImageRootNode extends NodeInterface<'data'> {
  type: 'image-root'
  root: true
  category: 'data'
  inputs: {
    image: {
      type: 'buffer'
      list: false
    }
  }
  rootOutput: {
    type: 'buffer'
    list: false
  }
}
