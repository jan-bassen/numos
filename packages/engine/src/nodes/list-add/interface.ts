import type { NodeInterface } from '@repo/engine/types/node-types'
import type { ValueType } from '@repo/engine/types/value-types'

export interface ListAddNode extends NodeInterface<'data'> {
  type: 'list-add'
  category: 'data'
  inputs: {
    list: {
      type: ValueType
      list: true
    }
    value: {
      type: ValueType
      list: false
    }
  }
  controls: {
    position: {
      type: 'enum'
      list: false
      settings: {
        options: [
          {
            value: 'start'
            label: 'Start'
          },
          {
            value: 'end'
            label: 'End'
          },
        ]
      }
    }
  }
  outputs: {
    output: {
      type: ValueType
      list: true
    }
  }
}
