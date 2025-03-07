import { Err } from '@repo/shared/result/err'

export type NodeErrLocation = {
  component?: {
    key: string
    type: 'input' | 'output' | 'control'
  }
  input?: {
    key: string
    type: 'metadata' | 'attributes' | 'parameters'
  }
}

export class NodeErr extends Err<'node'> {
  constructor(
    message: string,
    public location: NodeErrLocation,
  ) {
    super(message, 'node', { location })
  }
  convertToGraphError(
    node: string,
    overwriteLocation?: {
      component?: { key: string; type: 'input' | 'output' | 'control' }
      input?: { key: string; type: 'metadata' | 'attributes' | 'parameters' }
    },
  ) {
    return this.convert('graph', {
      location: {
        node,
        ...this.location,
        ...overwriteLocation,
      },
    })
  }
}
