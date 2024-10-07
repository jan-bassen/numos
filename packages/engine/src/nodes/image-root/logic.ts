import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ImageRootNode } from './interface.ts'

export const imageRootLogic: NodeLogic<ImageRootNode> = {
  root: ({ getInputValue }) => {
    const image = getInputValue('image')
    return image
  },
}
