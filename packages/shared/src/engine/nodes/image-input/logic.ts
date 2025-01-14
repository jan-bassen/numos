import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ImageInputNode } from '@repo/shared/engine/nodes/image-input/interface'

export const imageInputLogic: NodeLogic<ImageInputNode> = {
  data: {
    image: async ({ getControlValue, getLayer }) => {
      const name = getControlValue('image')
      return await getLayer(name.value)
    },
  },
}
