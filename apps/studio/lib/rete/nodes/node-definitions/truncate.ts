import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { TruncateNode } from '@repo/engine/nodes/truncate/interface'

export const truncateDefinition: SpecificNodeDefinition<TruncateNode> = {
  type: 'truncate',
  category: 'data',
  title: 'Truncate',
  nodeInfo: {
    description: 'This node allows you to truncate a string to a given length.',
    link: '#truncate',
    example: "(Length: 3): 'Hello World' = 'Hel'",
  },
  inputs: [
    { key: 'text', type: 'string', label: 'Text' },
    { key: 'length', type: 'number', label: 'Length' },
  ],
  outputs: [{ key: 'output', type: 'string', label: 'Output' }],
}
