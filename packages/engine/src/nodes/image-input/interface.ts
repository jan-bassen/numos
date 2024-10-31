import type { NodeInterface } from '@repo/engine/types/node-types'

export interface ImageInputNode extends NodeInterface<'data'> {
  type: 'image-input'
  category: 'data'
  controls: {
    image: {
      type: 'image'
      list: false
    }
  }
  outputs: {
    image: {
      type: 'buffer'
      list: false
    }
  }
}
