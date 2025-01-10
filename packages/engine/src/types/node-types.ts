import type { nodeTypes } from '@repo/engine/nodes/nodetypes'
import type { EngineContext, LogEntry } from '@repo/engine/types/engine-types'
import type { BasicMetadataKeys } from '@repo/engine/types/token-types'
import type { Value, ValueSettings, ValueType } from '@repo/shared/types/values'

// ----------- NODE INTERFACE -------------

export type NodeType = (typeof nodeTypes)[number]

export type SocketInterface<VT extends ValueType = ValueType> = {
  type: VT
  list: boolean
  settings?: ValueSettings<VT> //useless for now
}

export type ControlInterface<VT extends ValueType = ValueType> = {
  type: VT
  list: boolean
  settings?: ValueSettings<VT> //useless for now
}

export type SocketInterfaceMap = Record<string, SocketInterface>
export type ControlInterfaceMap = Record<string, ControlInterface>

export type NodeCategory = 'data' | 'exec' | 'hybrid'

export interface NodeInterface<
  T extends NodeCategory,
  R extends boolean = boolean,
> {
  type: NodeType
  category: T
  root?: R
  rootOutput?: R extends true ? SocketInterface : never
  inputs?: SocketInterfaceMap
  outputs?: T extends 'hybrid'
    ? SocketInterfaceMap
    : T extends 'data'
      ? R extends true
        ? never
        : SocketInterfaceMap
      : never
  controls?: ControlInterfaceMap
  forwards?: T extends 'exec' | 'hybrid' ? string[] | undefined : never
}

export interface AnyNode extends NodeInterface<NodeCategory> {
  inputs: SocketInterfaceMap
  outputs: SocketInterfaceMap
  controls: ControlInterfaceMap
}

export interface AnyDataNode extends NodeInterface<NodeCategory> {
  category: 'data' | 'hybrid'
  inputs: SocketInterfaceMap
  outputs: SocketInterfaceMap
  controls: ControlInterfaceMap
}

export interface AnyExecNode extends NodeInterface<NodeCategory> {
  category: 'exec' | 'hybrid'
  inputs?: SocketInterfaceMap
  outputs?: SocketInterfaceMap
  controls?: ControlInterfaceMap
  forwards?: string[]
}

export type InferredSocketValue<
  I extends NodeInterface<NodeCategory>,
  T extends 'inputs' | 'outputs',
  K extends keyof I[T],
> = I[T] extends SocketInterfaceMap
  ? Value<
      I[T][K]['type'],
      I[T][K]['list'] extends true
        ? 'array'
        : I[T][K]['list'] extends false
          ? 'single'
          : 'single' | 'array'
    >
  : never

export type InferredControlValue<
  I extends NodeInterface<NodeCategory>,
  K extends keyof I['controls'],
> = I['controls'] extends ControlInterfaceMap
  ? Value<
      I['controls'][K]['type'],
      I['controls'][K]['list'] extends true
        ? 'array'
        : I['controls'][K]['list'] extends false
          ? 'single'
          : 'single' | 'array'
    >
  : never

export type InferredRootValue<I extends NodeInterface<NodeCategory>> =
  I['rootOutput'] extends SocketInterface
    ? Value<
        I['rootOutput']['type'],
        I['rootOutput']['list'] extends true
          ? 'array'
          : I['rootOutput']['list'] extends false
            ? 'single'
            : 'single' | 'array'
      >
    : never

export type InferredSocketType<
  I extends NodeInterface<NodeCategory>,
  T extends 'inputs' | 'outputs',
  K extends keyof I[T],
> = I[T] extends SocketInterfaceMap ? I[T][K]['type'] : never

export type InferredControlType<
  I extends NodeInterface<NodeCategory>,
  K extends keyof I['controls'],
> = I['controls'] extends ControlInterfaceMap ? I['controls'][K]['type'] : never

export type InferredSocketList<
  I extends NodeInterface<NodeCategory>,
  T extends 'inputs' | 'outputs',
  K extends keyof I[T],
> = I[T] extends SocketInterfaceMap ? I[T][K]['list'] : never

export type InferredControlList<
  I extends NodeInterface<NodeCategory>,
  K extends keyof I['controls'],
> = I['controls'] extends ControlInterfaceMap ? I['controls'][K]['list'] : never

// TODO: Make async
export type DataInterface<
  I extends NodeInterface<NodeCategory>,
  Simulation extends boolean = boolean,
> = {
  getLayer: (image: string) => Promise<Value<'buffer', 'single'>>
  getParameter: (
    key: string,
  ) => Simulation extends true
    ? Value<ValueType, 'array' | 'single'>
    : Promise<Value<ValueType, 'array' | 'single'>>
  getTokenAttribute: (
    key: string,
  ) => Simulation extends true
    ? Value<ValueType, 'array' | 'single'>
    : Promise<Value<ValueType, 'array' | 'single'>>
  getMetadata: <K extends BasicMetadataKeys>(
    key: K,
  ) => Simulation extends true
    ? Value<K extends 'id' ? 'number' : 'string', 'single'>
    : Promise<Value<K extends 'id' ? 'number' : 'string', 'single'>>
  getInputValue: <K extends keyof I['inputs']>(
    key: K,
  ) => Promise<InferredSocketValue<I, 'inputs', K>>
  getControlValue: <K extends keyof I['controls']>(
    key: K,
  ) => InferredControlValue<I, K>
}

export type StateChangeResult = {
  previous: Value<ValueType, 'array' | 'single'>
  changed: boolean
}

export type MetadataChangeResult = {
  previous: Value<'string', 'single'>
  changed: boolean
}

export type ExecutionInterface<
  I extends NodeInterface<NodeCategory>,
  Simulation extends boolean = false,
> = DataInterface<I> & {
  revert: () => void
  setTokenAttribute: (
    key: string,
    value: Value<ValueType, 'array' | 'single'>,
  ) => Simulation extends true ? StateChangeResult : Promise<StateChangeResult>
  setMetadata: (
    key: 'name' | 'description',
    value: string,
  ) => Simulation extends true
    ? MetadataChangeResult
    : Promise<MetadataChangeResult>
}

// ----------- NODE LOGIC -------------

export type NodeContext = EngineContext & {
  nodeId: string
}

export type ExecutionNodeOutput<I extends NodeInterface<NodeCategory>> =
  I['forwards'] extends string[]
    ? {
        log: LogEntry
        forward: I['forwards'][number]
      }
    : {
        log: LogEntry
      }

export type AnyExecutionNodeOutput = {
  log: LogEntry
  forward?: string
}

export type NodeExecution<
  I extends NodeInterface<NodeCategory>,
  Simulation extends boolean = boolean,
> = (
  state: ExecutionInterface<I, Simulation>,
  context: NodeContext,
) => ExecutionNodeOutput<I> | Promise<ExecutionNodeOutput<I>>

export type DynamicNodeData<
  I extends NodeInterface<NodeCategory>,
  Simulation extends boolean = boolean,
> = <K extends keyof I['outputs']>(
  key: K,
  state: DataInterface<I, Simulation>,
  context: NodeContext,
) =>
  | InferredSocketValue<I, 'outputs', K>
  | Promise<InferredSocketValue<I, 'outputs', K>>

export type StaticNodeData<
  I extends NodeInterface<NodeCategory>,
  _Simulation extends boolean = boolean,
> = {
  [K in keyof I['outputs']]: (
    state: DataInterface<I>,
    context: NodeContext,
  ) =>
    | InferredSocketValue<I, 'outputs', K>
    | Promise<InferredSocketValue<I, 'outputs', K>>
}

export type RootNodeFunction<I extends NodeInterface<NodeCategory>> = (
  state: DataInterface<I>,
  context: NodeContext,
) => InferredRootValue<I> | Promise<InferredRootValue<I>>

export type NodeData<
  I extends NodeInterface<NodeCategory>,
  Simulation extends boolean = boolean,
> = StaticNodeData<I, Simulation> | DynamicNodeData<I, Simulation>

export type NodeLogic<I extends NodeInterface<NodeCategory>> =
  I['category'] extends 'exec'
    ? {
        execution: NodeExecution<I>
      }
    : I['category'] extends 'data'
      ? I['root'] extends true
        ? {
            root: RootNodeFunction<I>
          }
        : {
            data: NodeData<I>
          }
      : I['category'] extends 'hybrid'
        ? {
            execution: NodeExecution<I>
            data: NodeData<I>
          }
        : never

export interface AnyNodeForLogic {
  inputs?: SocketInterfaceMap
  outputs?: SocketInterfaceMap
  controls?: ControlInterfaceMap
}

export type AnyNodeLogic<
  Category extends NodeCategory = NodeCategory,
  Simulation extends boolean = boolean,
> = {
  execution?: NodeExecution<AnyExecNode, Simulation>
  data?: NodeData<NodeInterface<Category, boolean>>
  root?: RootNodeFunction<NodeInterface<Category, boolean>>
}
