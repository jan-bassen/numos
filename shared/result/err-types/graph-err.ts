import type { NodeErrLocation } from '@repo/shared/result/err-types/node-err'
import { Err } from '@repo/shared/result/err'

export type GraphErrLocation = NodeErrLocation & {
  node: string
}

export class GraphErr extends Err<'graph'> {
  constructor(
    message: string,
    public location: GraphErrLocation,
  ) {
    super(message, 'graph', { location })
  }
}
