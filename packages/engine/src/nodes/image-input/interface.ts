import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface ImageInputNode extends NodeInterface<'data'> {
  type: 'image-input'
  category: 'data'
  controls: {
    image: {
      type: 'buffer'
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
