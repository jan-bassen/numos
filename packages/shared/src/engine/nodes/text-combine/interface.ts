import type { NodeInterface } from '@repo/shared/types/node-types'

export interface TextCombineNode extends NodeInterface<'data'> {
  type: 'text-combine'
  category: 'data'
  inputs: {
    part1: {
      type: 'string'
      list: false
    }
    part2: {
      type: 'string'
      list: false
    }
  }
  controls: {
    separator: {
      type: 'string'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'string'
      list: false
    }
  }
}
