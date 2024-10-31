import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ClampNode } from '@repo/engine/nodes/clamp/interface'

export const clampDefinition: SpecificNodeDefinition<ClampNode> = {
  type: 'clamp',
  category: 'data',
  title: 'Clamp',
  nodeInfo: {
    description: 'This node clamps a number to a given range.',
    example: '(Min: 0, Max: 10): 15 = 10',
    link: '#clamp',
  },
  inputs: [
    { key: 'number', type: 'number', label: 'Number' },
    { key: 'min', type: 'number', label: 'Min' },
    { key: 'max', type: 'number', label: 'Max' },
  ],
  outputs: [{ key: 'output', type: 'number', label: 'Result' }],
}
