import type { NodeLogic } from '@repo/shared/types/node-types'
import type { MetadataNode } from '@repo/shared/engine/nodes/metadata/interface'

export const metadataLogic: NodeLogic<MetadataNode> = {
  data: {
    id: ({ getMetadata }) => getMetadata('id'),
    name: ({ getMetadata }) => getMetadata('name'),
    description: ({ getMetadata }) => getMetadata('description'),
  },
}
