import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ImageRootNode } from '@repo/shared/engine/nodes/image-root/interface'

export const imageRootDefinition: SpecificNodeDefinition<ImageRootNode> = {
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
  inputs: [
    {
      key: 'image',
      type: 'buffer',
      list: false,
      label: 'Image',
      hideControl: true,
    },
  ],
}
