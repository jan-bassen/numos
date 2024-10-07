import type { NodeInterface } from '@repo/engine/types/node-types.ts'

export interface SwitchNode extends NodeInterface<'exec'> {
  type: 'switch'
  category: 'exec'
  forwards: ['true', 'false']
  inputs: {
    switch: {
      list: false
      type: 'boolean'
    }
  }
}
