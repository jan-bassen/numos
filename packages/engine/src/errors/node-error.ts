import type { NodeErrorData } from '@repo/engine/types/engine-types'

export class NodeError extends Error {
  name = 'NodeError'
  constructor(
    message: string,
    public location: {
      component?: {
        key: string
        type: 'input' | 'output' | 'control'
      }
      input?: {
        key: string
        type: 'metadata' | 'attributes' | 'parameters'
      }
    },
  ) {
    super(message)
  }
  serialize = (): NodeErrorData => {
    return {
      type: 'node',
      message: this.message,
      location: this.location,
    }
  }
}
