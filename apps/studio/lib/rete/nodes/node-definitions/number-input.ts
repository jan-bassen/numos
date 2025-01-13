import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { NumberInputNode } from '@repo/shared/engine/nodes/number-input/interface'

export const numberInputDefinition: SpecificNodeDefinition<NumberInputNode> = {
  type: 'number-input',
  category: 'data',
  title: 'Number',
  componentType: 'input',
  nodeInfo: {
    description: 'This node allows you to input a number.',
    link: '#number-input',
  },
  controls: [{ key: 'number', type: 'number' }],
  outputs: [{ key: 'output', type: 'number', label: 'Output' }],
}
