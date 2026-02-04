import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ImageInputNode } from '@repo/shared/engine/nodes/image-input/interface'

export const imageInputDefinition: SpecificNodeDefinition<ImageInputNode> = {
  type: 'image-input',
  category: 'data',
  title: 'Pick Image',
  root: false,
  componentType: 'input',
  nodeInfo: {
    description: 'This node outputs the selected image from the Uploads page.',
    link: '#',
  },
  controls: [{ key: 'image', type: 'image' }],
  outputs: [{ key: 'image', type: 'buffer', label: 'Image' }],
}
