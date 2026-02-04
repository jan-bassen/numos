import type { NodeInterface } from '@repo/shared/types/node-types'

export interface ImageCombineNode extends NodeInterface<'data'> {
  type: 'image-combine'
  category: 'data'
  inputs: {
    image1: {
      type: 'buffer'
      list: false
    }
    image2: {
      type: 'buffer'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'buffer'
      list: false
    }
  }
}
