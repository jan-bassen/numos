import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { MetadataNode } from './interface.ts'

export const metadataLogic: NodeLogic<MetadataNode> = {
  data: {
    id: ({ getMetadata }) => getMetadata('id'),
    name: ({ getMetadata }) => getMetadata('name'),
    description: ({ getMetadata }) => getMetadata('description'),
  },
}
