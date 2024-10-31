import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { MetadataNode } from '@repo/engine/nodes/metadata/interface'

export const metadataDefinition: SpecificNodeDefinition<MetadataNode> = {
  type: 'metadata',
  category: 'data',
  title: 'Metadata',
  nodeInfo: {
    description: 'This node allows you to get the metadata of a token.',
    link: '#meta-data',
  },
  outputs: [
    {
      key: 'id',
      type: 'number',
      label: 'ID',
    },
    {
      key: 'name',
      type: 'string',
      label: 'Name',
    },
    {
      key: 'description',
      type: 'string',
      label: 'Description',
    },
  ],
}
