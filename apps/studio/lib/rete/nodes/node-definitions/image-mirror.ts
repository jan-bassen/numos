import type { NodeDefinition2 } from '@/types/nodes.types'
import type { ImageMirrorNode } from '@repo/engine/src/nodes/image-mirror/interface'

export const imageMirrorDefinition: NodeDefinition2<ImageMirrorNode> = {
  type: 'image-mirror',
  category: 'data',
  title: 'Mirror',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description: 'This node mirrors the image horizontally or vertically.',
    link: '#',
  },
  controls: [
    {
      key: 'mirror',
      type: 'enum',
      label: 'Mirror',
      placeholder: 'Select Direction',
      defaultValue: 'horizontal',
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ],
    },
  ],
  inputs: [{ key: 'image', type: 'buffer', label: 'Image' }],
  outputs: [{ key: 'output', type: 'buffer', label: 'Image' }],
}
