import type { EditorConfig, EditorContext } from '@/types/nodes.types'
import { PiPhotoImageDefaultStroke } from '@repo/ui/icons/pika'
import { baseConfig } from './base-config'
import { nodeDefinitions } from './definitions'

export const imageConfig: EditorConfig = (context: EditorContext) => {
  return {
    type: 'data',
    root: { type: 'image-root', position: { x: 50, y: -50 } },
    nodes: nodeDefinitions,
    blocklist: [],
    groups: [
      {
        label: 'Image',
        key: 'image',
        Icon: PiPhotoImageDefaultStroke,
        subitems: [
          'image-input',
          {
            key: 'image-combine',
            label: 'Composite',
            subitems: ['image-combine'],
          },
          {
            key: 'img-transform',
            label: 'Transform',
            subitems: ['image-mirror', 'image-rotate'],
          },
        ],
      },
      ...baseConfig(context),
    ],
  }
}
