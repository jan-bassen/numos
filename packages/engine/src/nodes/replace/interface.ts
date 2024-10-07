import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface ReplaceNode extends NodeInterface<'data'> {
  type: 'replace'
  category: 'data'
  inputs: {
    text: {
      type: 'string'
      list: false
    }
    search: {
      type: 'string'
      list: false
    }
    replace: {
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
