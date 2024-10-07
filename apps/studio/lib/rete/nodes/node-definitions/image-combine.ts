import type { NodeDefinition2 } from '@/types/nodes.types'
import type { ImageCombineNode } from '@repo/engine/src/nodes/image-combine/interface'

export const imageCombineDefinition: NodeDefinition2<ImageCombineNode> = {
  type: 'image-combine',
  category: 'data',
  title: 'Merge',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description:
      'This node adds one image on top of another. If the overlayed image is bigger than the base image, it will be cropped.',
    link: '#',
  },
  inputs: [
    { key: 'image1', type: 'buffer', label: 'Overlay' },
    { key: 'image2', type: 'buffer', label: 'Background' },
  ],
  outputs: [{ key: 'output', type: 'buffer', label: 'Image' }],
}
