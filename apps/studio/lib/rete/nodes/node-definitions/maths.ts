import type { NodeDefinition2 } from '@/types/nodes.types'
import type { MathsNode } from '@repo/engine/src/nodes/maths/interface'

export const mathsDefinition: NodeDefinition2<MathsNode> = {
  type: 'maths',
  category: 'data',
  title: 'Math',
  nodeInfo: {
    description: 'This node allows you perform basic math calculations.',
    example: '(Mode: Add): 1.23 + 2.34 = 3.57',
    link: '#math',
  },
  inputs: [
    { key: 'number1', type: 'number', label: 'Number 1' },
    { key: 'number2', type: 'number', label: 'Number 2' },
  ],
  controls: [
    {
      key: 'mode',
      type: 'enum',
      label: 'Mode',
      placeholder: 'Select Mode',
      defaultValue: 'add',
      options: [
        { value: 'add', label: 'Add' },
        { value: 'sub', label: 'Subtract' },
        { value: 'mul', label: 'Multiply' },
        { value: 'div', label: 'Divide' },
      ],
    },
  ],
  outputs: [{ key: 'output', type: 'number', label: 'Result' }],
}
