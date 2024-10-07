import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ImageInputNode } from './interface.ts'

export const imageInputLogic: NodeLogic<ImageInputNode> = {
  data: {
    image: async ({ getControlValue }) => {
      return getControlValue('image')
    },
  },
}
