import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ImageCombineNode } from './interface.ts'
import sharp from 'sharp'

export const ImageCombineLogic: NodeLogic<ImageCombineNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const buffer1 = getInputValue('image1').value
      const buffer2 = getInputValue('image2').value

      const image1 = await sharp(buffer1).metadata()
      const image2 = await sharp(buffer2).metadata()

      let overlay = buffer1
      let res: Buffer | undefined

      if (image1.width && image1.height && image2.width && image2.height) {
        if (image1.width > image2.width || image1.height > image2.height) {
          overlay = await sharp(buffer1)
            .resize({
              width: image2.width,
              height: image2.height,
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            })
            .toBuffer()
        }
        res = await sharp(buffer2)
          .composite([{ input: overlay }])
          .toBuffer()
      }

      if (!res) throw new Error('No image produced at combine node')

      return {
        type: 'buffer',
        format: 'single',
        value: res,
      }
    },
  },
}
