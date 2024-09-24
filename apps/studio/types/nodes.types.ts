import type { GetSchemes, NodeBase } from 'rete'
import type { ReactArea2D, RenderEmit } from 'rete-react-plugin'
import type {
  Action,
  Attribute,
  DataType,
  DataTypeValue,
  ReturnInfo,
  SocketType,
  NotatedDataTypeValueMap,
  ValueDataType,
  NotatedDataTypeValue,
  ValueSocketType,
  OptionalTokenState,
  ValueSettings,
  LegacyLayerTree,
  LayerTree,
  Collection,
  Version,
} from './database.types'
import type { Node } from '@/lib/rete/classes/node'
import type { Socket } from '@/lib/rete/classes/socket'
import type { Control } from '@/lib/rete/classes/control'
import type { ActionNodeType } from '@/lib/rete/nodes/definitions/action-nodes'
import type { ImageNodeType } from '@/lib/rete/nodes/definitions/image-nodes'
import type { ContextMenuExtra } from 'rete-context-menu-plugin'
import type { FullFileObject } from '@/lib/supabase/storage/user-images'
import type { Connection } from '@/lib/rete/classes/connection'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'
import type { NodeEditor } from '@/lib/rete/classes/editor'

import type { Input } from '@/lib/rete/classes/input'
import type { DataNodeType } from '@/lib/rete/nodes/definitions/data-nodes'
import type { MathNodeType } from '@/lib/rete/nodes/definitions/math-nodes'
import type { TextNodeType } from '@/lib/rete/nodes/definitions/text-nodes'
import type { LogicNodeType } from '@/lib/rete/nodes/definitions/logic-nodes'
import type { TimeNodeType } from '@/lib/rete/nodes/definitions/time-nodes'
import type { UtilityNodeType } from '@/lib/rete/nodes/definitions/utility-nodes'
import type { ColorNodeType } from '@/lib/rete/nodes/definitions/color-nodes'
import type {
  Parameter,
  ParameterState,
} from '@/components/elements/actions/action-schema'
import type { Output } from '@/lib/rete/classes/output'
import type {
  Intersect,
  Shape,
} from '@/lib/rete/classes/selector/multi-selector'
import type { AreaPlugin } from '@/lib/rete/classes/area/area-plugin'
import type { ZoomEventParams } from '@/lib/rete/classes/area/area'
import type { HistoryPlugin } from '@/lib/rete/classes/history/plugin'
import type { HistoryActions } from '@/lib/rete/classes/history/load-actions'

export type Schemes = GetSchemes<Node, Connection>
export type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra
export type Area = AreaPlugin
export type History = HistoryPlugin<Schemes, HistoryActions>

export type EditorType = 'image' | 'action'

export type NodeComponentType = 'input' | 'generic'

export type NodeType =
  | ActionNodeType
  | ImageNodeType
  | DataNodeType
  | MathNodeType
  | TextNodeType
  | LogicNodeType
  | TimeNodeType
  | UtilityNodeType
  | ColorNodeType

export type EditorContext = {
  type: EditorType
  attributes: Attribute[]
  parameters?: Parameter[]
  layers?: LayerTree
  action?: Action
}

export type EditorMode = 'select' | 'drag'
export type InputMode = 'mouse' | 'touchpad'
export type EditorSettings = {
  mode: EditorMode
  shape: Shape
  input: InputMode
  panningBoundary?: {
    intensity: number
    padding: number
  }
}

// Node Interfaces

export type Sockets = { [key: string]: Socket }
export type Inputs = { [key: string]: Input }
export type Outputs = { [key: string]: Output }
export type Controls = { [key: string]: Control }

export type SelectOption = {
  value: string
  label: string
  subtext?: string
  description?: string
  icons?: { stroke: (props: JSX.IntrinsicElements['svg']) => JSX.Element }
}

export type SelectOptions = SelectOption[]

export type EnumControlDefinition = ControlDefinitionBase & {
  type: 'enum'
  options: SelectOptions
}

export type GenericControlDefinition = ControlDefinitionBase & {
  type: Omit<ValueDataType, 'enum'>
}

export type ControlDefinition = EnumControlDefinition | GenericControlDefinition

export type ControlDefinitionBase = {
  index?: number
  key: string
  state?: string
  type: ValueDataType
  list?: boolean
  label?: string
  settings?: ValueSettings
  defaultValue?: DataTypeValue
  placeholder?: string
  onChange?: (node: Node, value: NotatedDataTypeValue<true, true>) => void
  readonly?: boolean
}

export type NotatedControlDefinition = {
  interfaceType: 'control'
  definition: ControlDefinition
}

export type EnumSocketDefinition = SocketDefinitionBase & {
  type: 'enum'
  options: SelectOptions
  adaptOptions?: boolean
}

export type GenericSocketDefinition = SocketDefinitionBase & {
  type: SocketType
  canBeList?: boolean
  settings?: ValueSettings
}

export type SocketDefinition = EnumSocketDefinition | GenericSocketDefinition

export type SocketDefinitionBase = {
  index?: number
  list?: boolean
  key: string
  state?: string
  label: string
  multipleConnections?: boolean
  hideControl?: boolean
  dividerAfter?: boolean
  control?: ControlDefinition
  compatibleWith?: DataType[]
  onConnect?: (node: Node, connection: Connection) => void
  onDisconnect?: (node: Node, connection: Connection) => void
}

/* export type InputDefinition = {
  key: string;
  state?: string;
  type: DataType;
  order?: {
    first: boolean;
    next: string;
  };
  label?: string;
  hideControl?: boolean;
  control?: ControlDefinition;
  onConnect?: (node: Node, connection: Connection) => void;
  onDisconnect?: (node: Node, connection: Connection) => void;
};

export type NotatedInputDefinition = {
  type: "input";
  definition: InputDefinition;
};

export type OutputDefinition = {
  key: string;
  type: DataType;
  state?: string;
  label?: string;
  onConnect?: (node: Node, connection: Connection) => void;
  onDisconnect?: (node: Node, connection: Connection) => void;
};

export type NotatedOutputDefinition = {
  type: "output";
  definition: OutputDefinition;
};

export type ActionDefinition = {
  type: string;
  buttonVariant?: ButtonVariant;
  label?: string;
  description?: string;
  icon: LucideIcon;
  action: () => void;
};

export type NotatedActionDefinition = {
  type: "action";
  definition: ActionDefinition;
};

export type NodeInterfaceDefinition =
  | NotatedInputDefinition
  | NotatedControlDefinition
  | NotatedOutputDefinition
  | NotatedActionDefinition; */

export type DynamicInputsDefinition =
  | SocketDefinition[]
  | ((node: Node, savedInputs?: SavedInputMap) => SocketDefinition[])

export type DynamicOutputsDefinition =
  | SocketDefinition[]
  | ((node: Node, savedOutputs?: SavedOutputMap) => SocketDefinition[])

export type DynamicControlsDefinition =
  | ControlDefinition[]
  | ((node: Node, savedControls?: SavedControlMap) => ControlDefinition[])

// NODES

export type NodeDefinition = {
  type: NodeType
  title: string
  root?: boolean
  componentType: NodeComponentType
  nodeInfo: NodeInfo
  inputs?: DynamicInputsDefinition
  outputs?: DynamicOutputsDefinition
  controls?: DynamicControlsDefinition
}

export type Position = { x: number; y: number }

export type DataMap = Record<string, NotatedDataTypeValue>

export type DataSimulationData = {
  state: NotatedDataTypeValueMap
  inputs: NotatedDataTypeValueMap
  controls: SavedControlMap
  node: SavedMapNode
}

export type DataSimulationResult = {
  state: NotatedDataTypeValueMap
  log: string | string[]
}

export type DBTransaction = PgTransaction<PostgresJsQueryResultHKT>

export type ExecutionData = {
  tx: DBTransaction
  inputs: DataMap
  controls: SavedControlMap
  node: SavedMapNode
}

export type ControlExecutionResult =
  | {
      tx: DBTransaction
      forward?: string
      log: string | string[]
    }
  | Promise<{
      tx: DBTransaction
      forward?: string
      log: string | string[]
    }>

export type SimulationContext = {
  version: Version
  attributes: Attribute[]
  parameters?: ParameterState
}

export type SimulationData = {
  node: SavedMapNode
  context: SimulationContext
  initialState: OptionalTokenState
  state: OptionalTokenState
  inputs: DataMap
  controls: SavedControlMap<false>
}

export type ControlSimulationData = {
  initialState: NotatedDataTypeValueMap
  state: NotatedDataTypeValueMap
  inputs: DataMap
  controls: SavedControlMap
  node: SavedMapNode
  context: SimulationContext
}

export type ControlSimulationResult = {
  state: OptionalTokenState
  forward?: string
  log: string | string[]
}

export type ControlGraphSimulationResult = {
  state: NotatedDataTypeValueMap
  logs: string[]
}

export type NodeLogicDefinition = {
  execute?: {
    execution?: (
      data: ExecutionData,
    ) => ControlExecutionResult | Promise<ControlExecutionResult>
    outputs?:
      | {
          [key: string]: (data: ExecutionData) => ControlExecutionResult
        }
      | ((key: string, data: ExecutionData) => ControlExecutionResult)
  }
  simulate: {
    execution?: (
      data: SimulationData,
    ) => ControlSimulationResult | Promise<ControlSimulationResult>
    outputs?:
      | {
          [key: string]: (
            data: SimulationData,
          ) => NotatedDataTypeValue | Promise<NotatedDataTypeValue>
        }
      | ((
          key: string,
          data: SimulationData,
        ) => NotatedDataTypeValue | Promise<NotatedDataTypeValue>)
  }
}

export type NodeLogicDefinitions<NT extends string = string> = {
  [key in NT]: NodeLogicDefinition
}

export type ExecNodeDefinition = {
  execute?: (
    data: ExecutionData,
  ) => ControlExecutionResult | Promise<ControlExecutionResult>
  simulate: (
    data: ControlSimulationData,
  ) => ControlSimulationResult | Promise<ControlSimulationResult>
}

export type DataNodeDefinition = {
  simulate: {
    [key: string]: (
      data: DataSimulationData,
    ) => NotatedDataTypeValue | Promise<NotatedDataTypeValue>
  }
  execute?: {
    [key: string]: (data: ExecutionData) => ControlExecutionResult
  }
}

export type DataNodeDefinitions<NT extends string = string> = {
  [key in NT]: DataNodeDefinition
}

export type ExecNodeDefinitions<NT extends string = string> = {
  [key in NT]: ExecNodeDefinition
}

export type HybridNodeDefinitions<NT extends string = string> = {
  [key in NT]: ExecNodeDefinition | DataNodeDefinition
}

export type NodeDefinitions<NT extends string = string> = {
  [key in NT]: NodeDefinition
}

export type NodeContext = {
  editor: NodeEditor
  area: Area
}

export type NodeIds = {
  node: NodeBase['id']
  inputs: { [key in string]: NodeBase['id'] }
  outputs: { [key in string]: NodeBase['id'] }
  controls: { [key in string]: NodeBase['id'] }
}

// COMPONENTS

export type NodeInfo = {
  description: string
  example?: string
  graphic?: string
  link?: string
}

export type NodeDisplayData = {
  [key: string]: any
}

export type NodeExtraData = {
  type: string
  width?: number
  height?: number
  nodeInfo?: NodeInfo
  root?: boolean
  displayData?: NodeDisplayData
}

export type Props = {
  data: Schemes['Node'] & NodeExtraData
  styles?: () => any
  emit: RenderEmit<Schemes>
  info?: NodeInfo
}

export type NodeComponent = (props: Props) => JSX.Element

//SAVED

export type Graph = {
  nodes: Node[]
  connections: Connection[]
}

export type SavedControl<AsObjectArray extends boolean = true> = {
  key: string
} & NotatedDataTypeValue<true, AsObjectArray>

export type PortBase = {
  id: string
  key: string
  type: DataType
}

export type SavedExecInput = PortBase & {
  type: 'exec'
}

export type ReversedSavedExecInput = PortBase & {
  type: 'exec'
  connection?: {
    node: string
    output: string
  }
}

export type SavedExecOutput = PortBase & {
  type: 'exec'
  connection?: {
    node: string
    input: string
  }
}

export type ReversedSavedExecOutput = PortBase & {
  type: 'exec'
}

export type SavedDataInput = PortBase & {
  type: ValueSocketType
  list: boolean
  connection?: {
    node: string
    output: string
  }
  control?: SavedControl
}

export type ReversedSavedDataInput = PortBase & {
  type: ValueSocketType
  list: boolean
  control?: SavedControl
}

export type SavedDataOutput = PortBase & {
  type: ValueSocketType
  list: boolean
}

export type ReversedSavedDataOutput = PortBase & {
  type: ValueSocketType
  list: boolean
  connection?: {
    node: string
    input: string
  }
}

export type SavedInput = SavedExecInput | SavedDataInput
export type SavedOutput = SavedExecOutput | SavedDataOutput

export type ReversedSavedInput = ReversedSavedExecInput | ReversedSavedDataInput
export type ReversedSavedOutput =
  | ReversedSavedExecOutput
  | ReversedSavedDataOutput

export function isExecOutput(
  output: SavedOutput,
): output is SavedExecOutput | ReversedSavedExecOutput {
  return output.type === 'exec'
}

export function isExecInput(
  input: SavedInput,
): input is SavedExecInput | ReversedSavedExecInput {
  return input.type === 'exec'
}

export type SavedInputMap = { [key: string]: Omit<SavedInput, 'connections'> }

export type SavedOutputMap = {
  [key: string]: Omit<SavedOutput, 'connections'>
}
export type ReversedSavedInputMap = {
  [key: string]: Omit<ReversedSavedInput, 'connections'>
}
export type ReversedSavedOutputMap = {
  [key: string]: Omit<ReversedSavedOutput, 'connections'>
}
export type SavedControlMap<AsObjectArray extends boolean = true> = {
  [key: string]: SavedControl<AsObjectArray>
}

export type SavedNode = {
  id: string
  type: NodeType
  x: number | null
  y: number | null
  inputs: SavedInputMap
  controls: SavedControlMap
  outputs: SavedOutputMap
  comment?: string
}

export type SavedMapNode = {
  id: string
  type: NodeType
  inputs: { [key: string]: SavedInput }
  controls: { [key: string]: SavedControl }
  outputs: { [key: string]: SavedOutput }
}

export type ReversedSavedMapNode = {
  id: string
  type: NodeType
  inputs: { [key: string]: ReversedSavedInput }
  controls: { [key: string]: SavedControl }
  outputs: { [key: string]: ReversedSavedOutput }
}

export type SavedConnection = {
  id: string
  source: string
  target: string
  sourceOutput: string
  targetInput: string
  type: SocketType
}

export type NodeMap = { [key: string]: SavedMapNode }
export type ReversedNodeMap = { [key: string]: ReversedSavedMapNode }

export type SavedGraph = {
  nodes: SavedNode[]
  connections: SavedConnection[]
}

//CONFIG

export type NodeConfig = Record<
  NodeType,
  {
    definition: NodeDefinition
    node: new (context: NodeContext, node?: SavedNode) => Node
  }
>

export type Item = {
  key: string
  label: string
  handler(mode: 'center' | 'pointer'): void
  Icon?: (props: JSX.IntrinsicElements['svg']) => JSX.Element
  subitems?: Item[]
}

export type Group<NT extends NodeType = NodeType> = {
  key: string
  label: string
  Icon?: (props: JSX.IntrinsicElements['svg']) => JSX.Element
  subitems: Array<NT | Group<NT> | 'separator'>
}

export type EditorConfig = (context: EditorContext) => ResolvedEditorConfig

export type ResolvedEditorConfig = {
  root: { type: NodeType; position: Position }
  blocklist: NodeType[]
  nodes: NodeDefinitions
  groups: Group<NodeType>[]
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export type MultiSelector = {
  setIntersect(intersect: Intersect): void
  setShape(shape: Shape): void
  setButton(button: 0 | 1): void
  setOptions(mode: EditorMode): void
  destroy: () => void
}

export type Editor = {
  destroy: () => void
  area: Area
  editor: NodeEditor
  history: History
}

export type EditorEvents = {
  onSelectionChanged?: (selection: string[]) => void
  onNodeMoved?: (editor: NodeEditor, id: string, position: Position) => void
  onNodeCreated?: (editor: NodeEditor, node: SavedNode) => void
  onNodeRemoved?: (editor: NodeEditor, node: Node) => void
  onConnectionCreated?: (
    editor: NodeEditor,
    connection: SavedConnection,
  ) => void
  onConnectionRemoved?: (
    editor: NodeEditor,
    connection: Connection | string,
  ) => void
  onNodeChanged?: (editor: NodeEditor, node: SavedNode) => void
  onRootNodeChanged?: (editor: NodeEditor, controls: SavedControlMap) => void
  onZoomed?: (editor: NodeEditor, params: ZoomEventParams) => void
}

export type AutoSaveFunctions = {
  uploadNode?: (node: SavedNode, parent: string) => Promise<ReturnInfo>
  deleteNode?: (nodeId: string) => Promise<ReturnInfo>
  saveNodePosition?: (nodeId: string, position: Position) => Promise<ReturnInfo>
  uploadConnection?: (
    connection: SavedConnection,
    parentId: string,
  ) => Promise<ReturnInfo>
  deleteConnection?: (connectionId: string) => Promise<ReturnInfo>
  updateNode?: (node: SavedNode) => Promise<ReturnInfo>
  changeSelection?: (selection: string[]) => void
}

//Selection
export type SelectorEntity = {
  label: string
  id: string
  unselect(): void
  translate(dx: number, dy: number): void
}

export type SelectableType = 'node' | 'connection'
