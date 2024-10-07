import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface MathsNode extends NodeInterface<'data'> {
  type: 'maths'
  category: 'data'
  inputs: {
    number1: {
      type: 'number'
      list: false
    }
    number2: {
      type: 'number'
      list: false
    }
  }
  controls: {
    mode: {
      type: 'enum'
      list: false
      settings: {
        options: [
          { value: 'add'; label: 'Add' },
          { value: 'subtract'; label: 'Subtract' },
          { value: 'mul'; label: 'Multiply' },
          { value: 'div'; label: 'Divide' },
        ]
      }
    }
  }
  outputs: {
    output: {
      type: 'number'
      list: false
    }
  }
}
