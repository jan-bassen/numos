// ----------- ERRORS -------------

import {
  DataType,
  type Value,
  type ValueMap,
} from '@repo/engine/types/value-types.ts'

export type NodeErrorData = {
  type: 'node'
  message: string
  location: {
    component?: {
      key: string
      type: 'input' | 'output' | 'control'
    }
    input?: {
      key: string
      type: 'metadata' | 'attributes' | 'parameters'
    }
  }
}

export type GraphErrorData = {
  type: 'graph'
  message: string
  location: {
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
}

// ----------- NEW ENGINE -------------

// Use a state interface with getters and setters for data
// Use engine as class
// Database for global attributes still missing!

// Errors in node doesnt need nodeId, the engine can handle that
// Most error should be handled in the functions anyways

// Preload only static data like attribute settings for validation

export type MapNode = { x: any }
export type Graph = Record<string, MapNode>

export type EngineContext = {
  collectionId: string // Or slug?
  actionId: string // Or slug?
  tokenId: number
}

export class EngineBase {
  constructor(
    private readonly graph: Graph,
    private readonly context: EngineContext,
    private readonly mode: 'simulation' | 'application',
    private readonly type: 'data' | 'execution',
  ) {}

  getControlValue(key: string) {}
  getConnectedNode(nodeId: string, side: 'input' | 'output', key: string) {}
  validateValue(value: Value) {}
}

// ----------- ENGINES -------------

export class SimulationEngine extends EngineBase {
  constructor(
    graph: Graph,
    context: EngineContext,
    type: 'data' | 'execution',
  ) {
    super(graph, context, 'simulation', type)
  }
  getTokenAttribute(key: string) {}
  getCollectionAttribute(key: string) {}
  getMetadata(key: string) {}
}

export class ApplicationEngine extends EngineBase {
  constructor(
    graph: Graph,
    context: EngineContext,
    type: 'data' | 'execution',
  ) {
    super(graph, context, 'application', type)
  }
  getTokenAttribute(key: string) {}
  getCollectionAttribute(key: string) {}
  getMetadata(key: string) {}
}

// ----------- ACTION ENGINES -------------

export class ActionSimulationEngine extends SimulationEngine {
  constructor(graph: Graph, context: EngineContext) {
    super(graph, context, 'execution')
  }
  execute(parameters: ValueMap) {}
  getParameter(key: string) {}
  setTokenAttribute(key: string, value: Value) {}
  setCollectionAttribute(key: string, value: Value) {}
  setMetadata(key: string, value: Value) {}
  getNodeOutput(nodeId: string, key: string) {}
}

export class ActionEngine extends ApplicationEngine {
  constructor(graph: Graph, context: EngineContext) {
    super(graph, context, 'execution')
  }
  execute(parameters: ValueMap) {}
  getParameter(key: string) {}
  setTokenAttribute(key: string, value: Value) {}
  setCollectionAttribute(key: string, value: Value) {}
  setMetadata(key: string, value: Value) {}
  getNodeOutput(nodeId: string, key: string) {}
}

// ----------- IMAGE ENGINES -------------

export class ImageEngine extends ApplicationEngine {
  constructor(graph: Graph, context: EngineContext) {
    super(graph, context, 'data')
  }
  setImage(key: string, value: Buffer) {}
  getNodeOutput(nodeId: string, key: string) {}
}

export class ImageSimulationEngine extends SimulationEngine {
  constructor(graph: Graph, context: EngineContext) {
    super(graph, context, 'data')
  }
  getNodeOutput(nodeId: string, key: string) {}
}
