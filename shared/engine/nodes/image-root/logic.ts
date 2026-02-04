import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ImageRootNode } from '@repo/shared/engine/nodes/image-root/interface'

export const imageRootLogic: NodeLogic<ImageRootNode> = {
  root: ({ getInputValue }) => {
    const image = getInputValue('image')
    return image
  },
}
