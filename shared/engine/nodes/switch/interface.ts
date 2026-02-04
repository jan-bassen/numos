import type { NodeInterface } from '@repo/shared/types/node-types'

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
