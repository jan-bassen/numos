import type { NodeType } from '@repo/engine/types/node-types'
import type {
  NodeValueMap,
  OptionalDataType,
  OptionalValueType,
  Value,
  ValueMap,
  ValueType,
} from '@repo/engine/types/value-types'

export type OLDSavedControl = {
  key: string
} & Value<ValueType, 'single' | 'array', true>

export type OLDPortBase = {
  id: string
  key: string
  type: OptionalDataType
}

export type OLDSavedExecInput = OLDPortBase & {
  type: 'exec'
}

export type OLDSavedExecOutput = OLDPortBase & {
  type: 'exec'
  connection?: {
    node: string
    input: string
  }
}

export type OLDSavedDataInput = OLDPortBase & {
  type: OptionalValueType
  list: boolean
  connection?: {
    node: string
    output: string
  }
  control?: OLDSavedControl
}

export type OLDSavedDataOutput = OLDPortBase & {
  type: OptionalValueType
  list: boolean
}

export type OLDSavedInput = OLDSavedExecInput | OLDSavedDataInput
export type OLDSavedOutput = OLDSavedExecOutput | OLDSavedDataOutput

export type OLDSavedInputMap = {
  [key: string]: Omit<OLDSavedInput, 'connections'>
}

export type OLDSavedOutputMap = {
  [key: string]: Omit<OLDSavedOutput, 'connections'>
}

export type OLDSavedControlMap = {
  [key: string]: OLDSavedControl
}

// --------------- NEW GRAPH ----------------

export type SavedNodeState = {
  inputs?: NodeValueMap
  controls?: NodeValueMap
}

export type SavedNode = {
  id: string
  type: NodeType
  x: number | null
  y: number | null
  state?: SavedNodeState
  comment?: string
}

export type SavedConnection = {
  id: string
  source: string
  target: string
  sourceOutput: string
  targetInput: string
  type: OptionalDataType
}

export type SavedGraph = {
  nodes: SavedNode[]
  connections: SavedConnection[]
}

// --------------- NEW MAP GRAPH ----------------

export type MapGraphDataInput = {
  connection?: MapGraphConnection
  controlValue?: Value<ValueType, 'single' | 'array', true>
}

export type MapGraphConnection = {
  connectionId: string
  node: string
  key: string
}

export type MapGraphNode = {
  id: string
  type: NodeType
  root: boolean
  inputs: Record<string, MapGraphDataInput>
  controls: Record<string, Value<ValueType, 'single' | 'array', true>>
  forwards: Record<string, MapGraphConnection>
}

export type MapGraph = { [key: string]: MapGraphNode }
