import type { MapGraph } from '@repo/engine/types/graph-types'
import type { EngineContext } from '@repo/engine/types/engine-types'
import { EngineBase } from '@repo/engine/engine/base/engine-base'

export class ApplicationEngine extends EngineBase {
  constructor(
    graph: MapGraph,
    context: EngineContext,
    type: 'data' | 'execution',
  ) {
    super(graph, context, 'application', type)
  }

  getTokenAttribute(key: string) {}

  getCollectionAttribute(key: string) {}

  getMetadata(key: string) {}
}
