import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ImageMirrorNode } from '@repo/engine/nodes/image-mirror/interface'
import sharp from 'sharp'
import { NodeError } from '@repo/engine/errors/node-error'

export const imageMirrorLogic: NodeLogic<ImageMirrorNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const image = await getInputValue('image')
      const mode = getControlValue('mirror').value
      switch (mode) {
        case 'horizontal':
          return {
            type: 'buffer',
            format: 'single',
            value: await sharp(image.value).flip().toBuffer(),
          }
        case 'vertical':
          return {
            type: 'buffer',
            format: 'single',
            value: await sharp(image.value).flop().toBuffer(),
          }
        default:
          throw new NodeError('Invalid mode', {
            component: {
              key: 'mode',
              type: 'control',
            },
          })
      }
    },
  },
}
