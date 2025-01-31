import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { CombineColorNode } from '@repo/shared/engine/nodes/combine-color/interface'

export const combineColorDefinition: SpecificNodeDefinition<CombineColorNode> =
  {
    type: 'combine-color',
    category: 'data',
    title: 'Combine',
    nodeInfo: {
      description: 'This node allows you to combine the components of a color.',
      link: '#combine-color',
    },
    inputs: [
      { key: 'red', type: 'number', label: 'Red' },
      { key: 'green', type: 'number', label: 'Green' },
      { key: 'blue', type: 'number', label: 'Blue' },
      { key: 'alpha', type: 'number', label: 'Alpha' },
    ],
    outputs: [{ key: 'color', type: 'color', label: 'Color' }],
  }
