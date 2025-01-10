import type { EngineContext } from '@repo/engine/types/engine-types'
import type { MapGraph } from '@repo/engine/types/graph-types'
import type { Value, ValueMap } from '@repo/shared/types/values'
import { ApplicationEngine } from '@repo/engine/engine/base/application-engine'

export class ActionEngine extends ApplicationEngine {
  constructor(graph: MapGraph, context: EngineContext) {
    super(graph, context)
    const variable = 'hello'
  }
  execute(parameters: ValueMap) {}
  getParameter(key: string) {}
  setTokenAttribute(key: string, value: Value) {}
  setCollectionAttribute(key: string, value: Value) {}
  setMetadata(key: string, value: Value) {}
  getNodeOutput(nodeId: string, key: string) {}
}
