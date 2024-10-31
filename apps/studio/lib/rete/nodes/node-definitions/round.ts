import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { RoundNode } from '@repo/engine/nodes/round/interface'

export const roundDefinition: SpecificNodeDefinition<RoundNode> = {
  type: 'round',
  category: 'data',
  title: 'Round',
  nodeInfo: {
    description:
      'This node rounds a number to a given precision, meaning it will always return a number with the given number of decimal places.',
    example: '(Precision: 2): 1.234567 = 1.23',
    link: '#round',
  },
  inputs: [
    { key: 'number', type: 'number', label: 'Number' },
    { key: 'precision', type: 'number', label: 'Precision' },
  ],
  outputs: [{ key: 'output', type: 'number', label: 'Result' }],
}
