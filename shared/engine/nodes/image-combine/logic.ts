import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ImageCombineNode } from '@repo/shared/engine/nodes/image-combine/interface'
import sharp from 'sharp'

export const ImageCombineLogic: NodeLogic<ImageCombineNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const buffer1 = await getInputValue('image1')
      const buffer2 = await getInputValue('image2')

      const image1 = await sharp(buffer1.value).metadata()
      const image2 = await sharp(buffer2.value).metadata()

      let overlay = buffer1.value
      let res: Buffer | undefined

      if (image1.width && image1.height && image2.width && image2.height) {
        if (image1.width > image2.width || image1.height > image2.height) {
          overlay = await sharp(buffer1.value)
            .resize({
              width: image2.width,
              height: image2.height,
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            })
            .toBuffer()
        }
        res = await sharp(buffer2.value)
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
