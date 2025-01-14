import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { LengthNode } from '@repo/shared/engine/nodes/length/interface'

export const lengthDefinition: SpecificNodeDefinition<LengthNode> = {
  type: 'length',
  category: 'data',
  title: 'Length',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description: 'This node returns the length of a string.',
    example: "'Hello' = 5",
    link: '#length',
  },
  inputs: [{ key: 'text', type: 'string', label: 'Text' }],
  outputs: [{ key: 'output', type: 'number', label: 'Output' }],
}
