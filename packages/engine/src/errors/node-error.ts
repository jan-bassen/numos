import type { NodeErrorData } from '@repo/engine/types/engine-types'
import { GraphError } from './graph-error.ts'

export class NodeError extends Error {
  name = 'NodeError'
  constructor(
    message: string,
    public location?: {
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
      location: this.location || {},
    }
  }
  convertToGraphError(
    node: string,
    overwriteLocation?: {
      component?: { key: string; type: 'input' | 'output' | 'control' }
      input?: { key: string; type: 'metadata' | 'attributes' | 'parameters' }
    },
  ) {
    return new GraphError(this.message, {
      node,
      ...this.location,
      ...overwriteLocation,
    })
  }
}
