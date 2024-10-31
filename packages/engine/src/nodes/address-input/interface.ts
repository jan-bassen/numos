import type { NodeInterface } from '@repo/engine/types/node-types'

export interface AddressInputNode extends NodeInterface<'data'> {
  type: 'address-input'
  category: 'data'
  controls: {
    address: {
      type: 'address'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'address'
      list: false
    }
  }
}
