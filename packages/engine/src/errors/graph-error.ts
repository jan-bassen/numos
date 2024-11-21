import type { GraphErrorData } from '@repo/engine/types/engine-types'

export type GraphErrorLocation = {
  node: string
  component?: {
    key: string
    type: 'input' | 'output' | 'control'
  }
  input?: {
    key: string
    type: 'metadata' | 'attributes' | 'parameters'
  }
}
export class GraphError extends Error {
  name = 'GraphError'
  constructor(
    message: string,
    public location: GraphErrorLocation,
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
