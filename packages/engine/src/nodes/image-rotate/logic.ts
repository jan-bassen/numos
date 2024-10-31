import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ImageRotateNode } from '@repo/engine/nodes/image-rotate/interface'
import sharp from 'sharp'

export const imageRotateLogic: NodeLogic<ImageRotateNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const image = await getInputValue('image')
      const angle = await getInputValue('angle')
      return {
        type: 'buffer',
        format: 'single',
        value: await sharp(image.value).rotate(angle.value).toBuffer(),
      }
    },
  },
}
