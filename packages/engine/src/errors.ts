import type { GraphErrorData, NodeErrorData } from './types'

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

export class NodeError extends Error {
  name = 'NodeError'
  constructor(
    message: string,
    private location: {
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
