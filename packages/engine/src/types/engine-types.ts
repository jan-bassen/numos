import type {
  Value,
  ValueFormat,
  ValueMap,
  ValueType,
} from '@repo/engine/types/value-types'

// ----------- ERRORS -------------

export type NodeErrorData = {
  type: 'node'
  message: string
  location?: {
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

export type UnknownErrorData = {
  type: 'unknown'
  message: string
}

// ----------- NEW ENGINE -------------

// Use a state interface with getters and setters for data
// Use engine as class
// Database for global attributes still missing!

// Errors in node doesnt need nodeId, the engine can handle that
// Most error should be handled in the functions anyways

// Preload only static data like attribute settings for validation

export type EngineContext = {
  collectionId: string
}

export type ActionContext = EngineContext & {
  actionId: string
}

export type SimulationData = {
  basicMetadata: {
    id?: Value<'number', 'single', true>
    name?: Value<'string', 'single', true>
    description?: Value<'string', 'single', true>
  }
  attributes: ValueMap<string, ValueType, 'single' | 'objectarray', true>
  parameters: ValueMap<string, ValueType, 'single' | 'objectarray', true>
}

export type SimulatedValueChange = {
  old: Value<ValueType, 'single' | 'array', false>
  new: Value<ValueType, 'single' | 'array', false>
  label?: string
}

export type SimulatedStateChange = Record<string, SimulatedValueChange>

export type LogEntry = {
  message: string
}

export type SimulatedTokenStateResult = {
  metadataChange: SimulatedStateChange
  stateChange: SimulatedStateChange
  logs: LogEntry[]
}

export type ImageSimulationResult =
  | {
      result: Value<'image', 'single', false>
      error: undefined
    }
  | {
      result: undefined
      error: GraphErrorData | UnknownErrorData
    }

export type ActionSimulationResult =
  | {
      result: undefined
      error: GraphErrorData | UnknownErrorData
    }
  | {
      result: SimulatedTokenStateResult
      error: undefined
    }
