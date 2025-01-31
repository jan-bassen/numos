import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { BooleanInputNode } from '@repo/shared/engine/nodes/boolean-input/interface'

export const booleanInputDefinition: SpecificNodeDefinition<BooleanInputNode> =
  {
    type: 'boolean-input',
    category: 'data',
    title: 'Yes/No',
    componentType: 'input',
    nodeInfo: {
      description:
        'This node allows you to input a boolean (true/false) value.',
      link: '#boolean-input',
    },
    controls: [{ key: 'boolean', type: 'boolean' }],
    outputs: [{ key: 'output', type: 'boolean', label: 'Output' }],
  }
