import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ImageRootNode } from '@repo/engine/nodes/image-root/interface'

export const imageRootLogic: NodeLogic<ImageRootNode> = {
  root: ({ getInputValue }) => {
    const image = getInputValue('image')
    return image
  },
}
