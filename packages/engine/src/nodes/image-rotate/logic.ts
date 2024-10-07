import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ImageRotateNode } from './interface.ts'
import sharp from 'sharp'

export const imageRotateLogic: NodeLogic<ImageRotateNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const image = getInputValue('image').value
      const angle = getInputValue('angle').value
      return {
        type: 'buffer',
        format: 'single',
        value: await sharp(image).rotate(angle).toBuffer(),
      }
    },
  },
}
