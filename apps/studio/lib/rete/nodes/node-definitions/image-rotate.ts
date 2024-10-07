import type { NodeDefinition2 } from '@/types/nodes.types'
import type { ImageRotateNode } from '@repo/engine/src/nodes/image-rotate/interface'

export const imageRotateDefinition: NodeDefinition2<ImageRotateNode> = {
  type: 'image-rotate',
  category: 'data',
  title: 'Rotate',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description:
      'This node rotates the image clockwise, for counter-clockwise you can use a negative value.',
    link: '#',
  },
  inputs: [
    { key: 'image', type: 'buffer', label: 'Image' },
    { key: 'angle', type: 'number', label: 'Angle (degrees)' },
  ],
  outputs: [{ key: 'output', type: 'buffer', label: 'Image' }],
}
