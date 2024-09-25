// ----------- VALUES -------------

// TODO: Add optional values to all types and add that also to the value map

export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'location'
  | 'direction'
  | 'weather'
  | 'buffer'

export type Direction = string // TODO: enum
export type WeatherCode = string // TODO: enum
export type Color = { r: number; g: number; b: number; a: number }
export type Location = { lat: number; lng: number }

export type StringValue = { type: 'string'; value: string; list: false }
export type NumberValue = { type: 'number'; value: number; list: false }
export type BooleanValue = { type: 'boolean'; value: boolean; list: false }
export type ColorValue = { type: 'color'; value: Color; list: false }
export type LocationValue = { type: 'location'; value: Location; list: false }
export type DirectionValue = {
  type: 'direction'
  value: Direction
  list: false
}
export type WeatherCodeValue = {
  type: 'weatherCode'
  value: WeatherCode
  list: false
}
export type BufferValue = { type: 'buffer'; value: Buffer; list: false }

export type StringListValue = { type: 'string'; value: string[]; list: true }
export type NumberListValue = { type: 'number'; value: number[]; list: true }
export type BooleanListValue = { type: 'boolean'; value: boolean[]; list: true }
export type ColorListValue = { type: 'color'; value: Color[]; list: true }
export type LocationListValue = {
  type: 'location'
  value: Location[]
  list: true
}
export type DirectionListValue = {
  type: 'direction'
  value: Direction[]
  list: true
}
export type WeatherCodeListValue = {
  type: 'weatherCode'
  value: WeatherCode[]
  list: true
}
export type BufferListValue = { type: 'buffer'; value: Buffer[]; list: true }

export type SingleValue<DT extends DataType = DataType> =
  | StringValue
  | NumberValue
  | BooleanValue
  | ColorValue
  | LocationValue
  | DirectionValue
  | WeatherCodeValue
  | BufferValue

export type ListValue =
  | StringListValue
  | NumberListValue
  | BooleanListValue
  | ColorListValue
  | LocationListValue
  | DirectionListValue
  | WeatherCodeListValue
  | BufferListValue

export type Value<DT extends DataType = DataType> =
  | SingleValue<DT>
  | ListValue<DT>
export type ValueMap<DT extends DataType = DataType> = Record<string, Value<DT>>

// ----------- ERRORS -------------

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
  getParameter: (key: string) => Value // Check if this can be handled better (parameters only exist in actions)
  getConnectedNode(nodeId: string, side: 'input' | 'output', key: string) {}
  getLayer(key: string) {}
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

// ----------- UTILS -------------

export const validate = (type: string, value: Value): string => {
  return value.value as string
}

// ----------- NODES -------------

export type ExecutionInterface<I extends { [key: string]: DataType }> =
  DataInterface & {
    setTokenAttribute: (key: keyof I, value: Value) => boolean
    setCollectionAttribute: (key: string, value: Value) => boolean
    setMetadata: (key: 'name' | 'description', value: string) => boolean
  }

export type DataInterface = {
  getLayer: (key: string) => Value
  getParameter: (key: string) => Value
  getControlValue: (key: string) => Value
  getInputValue: (key: string) => Value
  getTokenAttribute: (key: string) => Value
  getCollectionAttribute: (key: string) => Value
  getMetadata: (key: 'name' | 'description') => string
}

export type NodeContext = EngineContext & {
  nodeId: string
}

export type ExecutionNodeOutput = {
  log: { message: string }
  forward: string
}

export type DataNodeOutput = Value

export type NodeExecutionFunction<I extends { [key: string]: DataType }> = (
  state: ExecutionInterface<I>,
  context: NodeContext,
) => ExecutionNodeOutput | Promise<ExecutionNodeOutput>

export type NodeDataFunction = (
  state: DataInterface,
  context: NodeContext,
) => DataNodeOutput | Promise<DataNodeOutput>

export type DispatchNodeDataFunction = (
  key: string,
  state: DataInterface,
  context: NodeContext,
) => DataNodeOutput | Promise<DataNodeOutput>

export type NodeData =
  | Record<string, NodeDataFunction>
  | DispatchNodeDataFunction

//TODO: Enforce same input and output mode in types
export type HybridNodeLogic = {
  type: 'hybrid'
  execution: NodeExecutionFunction
  data: NodeData
}

export type ExecutionNodeLogic<
  I extends { [key: string]: DataType } = { [key: string]: DataType },
> = {
  type: 'execution'
  execution: NodeExecutionFunction<I>
}

export type DataNodeLogic = {
  type: 'data'
  data: NodeData
}

export type NodeLogic = HybridNodeLogic | ExecutionNodeLogic | DataNodeLogic
