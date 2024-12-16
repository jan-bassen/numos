import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ImageMirrorNode } from '@repo/engine/nodes/image-mirror/interface'

export const imageMirrorDefinition: SpecificNodeDefinition<ImageMirrorNode> = {
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
      default: { value: 'horizontal', type: 'enum', format: 'single' },
      restrictions: {
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
      },
    },
  ],
  inputs: [{ key: 'image', type: 'buffer', label: 'Image' }],
  outputs: [{ key: 'output', type: 'buffer', label: 'Image' }],
}
