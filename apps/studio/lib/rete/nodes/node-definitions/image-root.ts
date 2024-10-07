import type { NodeDefinition2 } from '@/types/nodes.types'
import type { ImageRootNode } from '@repo/engine/src/nodes/image-root/interface'

export const imageRootDefinition: NodeDefinition2<ImageRootNode> = {
  type: 'image-root',
  category: 'data',
  title: 'Output',
  root: true,
  componentType: 'generic',
  nodeInfo: {
    description:
      'This node outputs the resulting image, which will be image of your tokens.',
    link: '#',
  },
  inputs: [{ key: 'image', type: 'buffer', list: false, label: 'Image' }],
}
