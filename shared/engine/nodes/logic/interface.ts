import type { NodeInterface } from '@repo/shared/types/node-types'

export interface LogicNode extends NodeInterface<'data'> {
  type: 'logic'
  category: 'data'
  inputs: {
    boolean1: {
      type: 'boolean'
      list: false
    }
    boolean2: {
      type: 'boolean'
      list: false
    }
  }
  controls: {
    mode: {
      type: 'enum'
      list: false
      settings: {
        options: [
          {
            value: 'and'
            label: 'And'
          },
          {
            value: 'or'
            label: 'Or'
          },
          {
            value: 'not'
            label: 'Not'
          },
          {
            value: 'xor'
            label: 'Xor'
          },
          {
            value: 'nand'
            label: 'Nand'
          },
        ]
      }
    }
  }
  outputs: {
    output: {
      type: 'boolean'
      list: false
    }
  }
}
