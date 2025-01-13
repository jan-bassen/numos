import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { RandomNode } from '@repo/shared/engine/nodes/random/interface'

export const randomDefinition: SpecificNodeDefinition<RandomNode> = {
  type: 'random',
  category: 'data',
  title: 'Random',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description:
      'This node returns a random number between two numbers. Beware that the number is not rounded.',
    example: '(Min: 0, Max: 10): 15 = 11',
    link: '#random',
  },
  inputs: [
    { key: 'min', type: 'number', label: 'Min' },
    { key: 'max', type: 'number', label: 'Max' },
  ],
  outputs: [{ key: 'output', type: 'number', label: 'Random Number' }],
}
