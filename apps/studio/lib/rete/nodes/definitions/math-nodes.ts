import type { NodeDefinitions } from '@/types/nodes.types'

export type MathNodeType = 'maths' | 'round' | 'clamp' | 'random'

export const mathNodes: NodeDefinitions<MathNodeType> = {
  maths: {
    type: 'maths',
    title: 'Math',
    root: false,
    componentType: 'generic',
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
  },
  round: {
    type: 'round',
    title: 'Round',
    root: false,
    componentType: 'generic',
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
  },
  random: {
    type: 'random',
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
  },
  clamp: {
    type: 'clamp',
    title: 'Clamp',
    root: false,
    componentType: 'generic',
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
  },
}
