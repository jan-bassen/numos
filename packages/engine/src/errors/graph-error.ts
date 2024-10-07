import type { GraphErrorData } from '@repo/engine/types/engine-types.ts'

export class GraphError extends Error {
  name = 'GraphError'
  constructor(
    message: string,
    public location: {
      node: string
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
  serialize = (): GraphErrorData => {
    return {
      type: 'graph',
      message: this.message,
      location: this.location,
    }
  }
}
