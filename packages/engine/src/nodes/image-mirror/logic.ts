import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ImageMirrorNode } from './interface.ts'
import sharp from 'sharp'
import { NodeError } from '@repo/engine/errors/node-error.ts'

export const imageMirrorLogic: NodeLogic<ImageMirrorNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const image = getInputValue('image').value
      const mode = getControlValue('mode').value
      switch (mode) {
        case 'horizontal':
          return {
            type: 'buffer',
            format: 'single',
            value: await sharp(image).flip().toBuffer(),
          }
        case 'vertical':
          return {
            type: 'buffer',
            format: 'single',
            value: await sharp(image).flop().toBuffer(),
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
