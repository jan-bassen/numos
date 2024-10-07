import type { NodeDefinition2 } from '@/types/nodes.types'
import type { ImageInputNode } from '@repo/engine/src/nodes/image-input/interface'

export const imageInputDefinition: NodeDefinition2<ImageInputNode> = {
  type: 'image-input',
  category: 'data',
  title: 'Layer',
  root: false,
  componentType: 'input',
  nodeInfo: {
    description: 'This node outputs the selected image from the Layers page.',
    link: '#',
  },
  controls: [{ key: 'image', type: 'image' }],
  outputs: [{ key: 'image', type: 'buffer', label: 'Image' }],
}
