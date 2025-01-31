import type { NodeInterface } from '@repo/shared/types/node-types'

export interface ImageRotateNode extends NodeInterface<'data'> {
  type: 'image-rotate'
  category: 'data'
  inputs: {
    image: {
      type: 'buffer'
      list: false
    }
    angle: {
      type: 'number'
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
