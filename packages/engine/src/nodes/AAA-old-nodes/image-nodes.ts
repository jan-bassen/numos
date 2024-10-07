import {
  DataNodeDefinitions,
  type NodeLogicDefinitions,
} from '@/types/nodes.types'
import { GraphError } from '@/lib/errors'
import type { ImageNodeType } from '../definitions/image-nodes'
import sharp from 'sharp'
import { createSupabaseServiceClient } from '@/lib/supabase/service-client'
import 'server-only'
import { isValidValueType } from '@/components/datatypes/schemas'
import type { NotatedSingleBufferValue } from '@/types/database.types'

export const imageNodesLogic: NodeLogicDefinitions<ImageNodeType> = {
  'image-combine': {
    simulate: {
      outputs: {
        output: async ({ node, inputs }) => {
          const layer1 = inputs?.image1.value as Buffer | undefined
          if (!layer1) {
            throw new GraphError('Layer 1 not found', node.id, {
              type: 'input',
              id: node.inputs.image1.id,
            })
          }
          const layer2 = inputs?.image2.value as Buffer | undefined
          if (!layer2) {
            throw new GraphError('Layer 2 not found', node.id, {
              type: 'input',
              id: node.inputs.image2.id,
            })
          }
          let res: Buffer | undefined
          const image1 = await sharp(layer1).metadata()
          const image2 = await sharp(layer2).metadata()

          let overlay = layer1
          if (image1.width && image1.height && image2.width && image2.height) {
            if (image1.width > image2.width || image1.height > image2.height) {
              overlay = await sharp(layer1)
                .resize({
                  width: image2.width,
                  height: image2.height,
                  fit: sharp.fit.inside,
                  withoutEnlargement: true,
                })
                .toBuffer()
            }
            res = await sharp(layer2)
              .composite([{ input: overlay }])
              .toBuffer()

            if (!res)
              throw new GraphError('No image produced at combine node', node.id)
          }
          return {
            type: 'buffer',
            list: false,
            value: res,
          } as NotatedSingleBufferValue
        },
      },
    },
  },
  'image-input': {
    simulate: {
      outputs: {
        image: async ({ node, controls, context }) => {
          const collectionId = context.version.collection
          const layerId = controls?.image.value as Buffer | undefined
          if (typeof layerId !== 'string')
            throw new GraphError('Error with image', node.id)
          if (!layerId)
            throw new GraphError('No image set', node.id, {
              type: 'control',
              id: node.controls.image.key,
            })
          const path = `/${collectionId}/${layerId}`

          //TODO: Make this safer
          const supabaseService = await createSupabaseServiceClient()
          const { data: image, error } = await supabaseService.storage
            .from('layers')
            .download(path)

          if (error) {
            throw new GraphError(error.message, node.id, {
              type: 'control',
              id: node.controls.image.key,
            })
          }

          if (!image || image.type.split('/')[0] !== 'image')
            throw new GraphError('Received invalid image', node.id, {
              type: 'control',
              id: node.controls.image.key,
            })
          const res = await sharp(await image.arrayBuffer()).toBuffer()

          return { type: 'buffer', list: false, value: res }
        },
      },
    },
  },
  'image-root': {
    simulate: {
      outputs: {
        output: ({ node, inputs }) => {
          const image = inputs?.image.value as Buffer | undefined
          if (!image) {
            throw new GraphError('Image not found', node.id, {
              type: 'input',
              id: node.inputs.image.id,
            })
          }
          return {
            type: 'string',
            list: false,
            value: Buffer.from(image).toString('base64'),
          }
        },
      },
    },
  },
  'image-mirror': {
    simulate: {
      outputs: {
        output: async ({ node, inputs }) => {
          const image = inputs?.image.value as Buffer | undefined
          if (!image) {
            throw new GraphError('Image not found', node.id, {
              type: 'input',
              id: node.inputs.image.id,
            })
          }
          const mirror = node.controls.mirror.value
          if (mirror === 'horizontal') {
            return {
              type: 'buffer',
              list: false,
              value: await sharp(image).flip().toBuffer(),
            }
          }
          if (mirror === 'vertical') {
            return {
              type: 'buffer',
              list: false,
              value: await sharp(image).flop().toBuffer(),
            }
          }
          throw new GraphError(`Invalid mirror value ${mirror}`, node.id, {
            type: 'control',
            id: node.controls.mirror.key,
          })
        },
      },
    },
  },
  'image-rotate': {
    simulate: {
      outputs: {
        output: async ({ node, inputs }) => {
          const image = inputs?.image.value as Buffer | undefined
          if (!image) {
            throw new GraphError('Image not found', node.id, {
              type: 'input',
              id: node.inputs.image.id,
            })
          }
          const angle = inputs?.angle?.value as number
          if (!isValidValueType('number', false, angle)) {
            throw new GraphError(`Invalid angle value ${angle}`, node.id, {
              type: 'control',
              id: node.controls.angle.key,
            })
          }
          if (!angle) {
            throw new GraphError('Angle not found', node.id, {
              type: 'input',
              id: node.inputs.angle.id,
            })
          }
          const rotatedImage = await sharp(image).rotate(angle).toBuffer()
          return {
            type: 'buffer',
            list: false,
            value: rotatedImage,
          }
        },
      },
    },
  },
}
