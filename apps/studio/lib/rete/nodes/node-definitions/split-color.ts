import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { SplitColorNode } from '@repo/engine/nodes/split-color/interface'

export const splitColorDefinition: SpecificNodeDefinition<SplitColorNode> = {
  type: 'split-color',
  category: 'data',
  title: 'Split Color',
  nodeInfo: {
    description: 'This node allows you to split a color into its components.',
    link: '#split-color',
  },
  inputs: [{ key: 'color', type: 'color', label: 'Color' }],
  outputs: [
    { key: 'red', type: 'number', label: 'Red' },
    { key: 'green', type: 'number', label: 'Green' },
    { key: 'blue', type: 'number', label: 'Blue' },
    { key: 'alpha', type: 'number', label: 'Alpha' },
  ],
}
