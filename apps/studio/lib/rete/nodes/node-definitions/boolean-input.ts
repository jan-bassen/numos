import type { NodeDefinition2 } from '@/types/nodes.types'
import type { BooleanInputNode } from '@repo/engine/src/nodes/boolean-input/interface'

export const booleanInputDefinition: NodeDefinition2<BooleanInputNode> = {
  type: 'boolean-input',
  category: 'data',
  title: 'Yes/No',
  nodeInfo: {
    description: 'This node allows you to input a boolean (true/false) value.',
    link: '#boolean-input',
  },
  controls: [{ key: 'boolean', type: 'boolean' }],
  outputs: [{ key: 'output', type: 'boolean', label: 'Output' }],
}
