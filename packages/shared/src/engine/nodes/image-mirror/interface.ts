import type { NodeInterface } from '@repo/shared/types/node-types'

export interface ImageMirrorNode extends NodeInterface<'data'> {
  type: 'image-mirror'
  category: 'data'
  inputs: {
    image: {
      type: 'buffer'
      list: false
    }
  }
  controls: {
    mirror: {
      type: 'enum'
      list: false
      settings: {
        options: [
          { value: 'horizontal'; label: 'Horizontal' },
          { value: 'vertical'; label: 'Vertical' },
        ]
      }
    }
  }
  outputs: {
    output: {
      type: 'buffer'
      list: false
    }
  }
}
