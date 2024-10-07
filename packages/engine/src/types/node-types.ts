// ----------- NODE INTERFACE -------------

import type { nodeTypes } from '../nodes/nodetypes.ts'
import type { EngineContext } from './engine-types.ts'
import type { Value, ValueSettings, ValueType } from './value-types.ts'

export type NodeType = (typeof nodeTypes)[number]

export type NodeComponentType<VT extends ValueType = ValueType> = {
  type: VT
  list: boolean
  settings?: ValueSettings<VT> //useless for now
}

export type NodeComponentTypeMap = Record<string, NodeComponentType>

export type NodeCategory = 'data' | 'exec' | 'hybrid'

export interface NodeInterface<
  T extends NodeCategory,
  R extends boolean = boolean,
> {
  type: NodeType
  category: T
  root?: R
  rootOutput?: R extends true ? NodeComponentType : never
  inputs?: NodeComponentTypeMap
  outputs?: T extends 'hybrid'
    ? NodeComponentTypeMap
    : T extends 'data'
      ? R extends true
        ? never
        : NodeComponentTypeMap
      : never
  controls?: NodeComponentTypeMap
  forwards?: T extends 'exec' | 'hybrid' ? string[] | undefined : never
}

export type InferredValue<
  I extends NodeInterface<NodeCategory>,
  T extends 'inputs' | 'outputs' | 'controls',
  K extends keyof I[T],
> = I[T] extends NodeComponentTypeMap
  ? Value<
      I[T][K]['type'],
      I[T][K]['list'] extends true
        ? 'array'
        : I[T][K]['list'] extends false
          ? 'single'
          : 'single' | 'array'
    >
  : never

export type InferredRootValue<I extends NodeInterface<NodeCategory>> =
  I['rootOutput'] extends NodeComponentType
    ? Value<
        I['rootOutput']['type'],
        I['rootOutput']['list'] extends true
          ? 'array'
          : I['rootOutput']['list'] extends false
            ? 'single'
            : 'single' | 'array'
      >
    : never

export type InferredType<
  I extends NodeInterface<NodeCategory>,
  T extends 'inputs' | 'outputs' | 'controls',
  K extends keyof I[T],
> = I[T] extends NodeComponentTypeMap ? I[T][K]['type'] : never

export type InferredList<
  I extends NodeInterface<NodeCategory>,
  T extends 'inputs' | 'outputs' | 'controls',
  K extends keyof I[T],
> = I[T] extends NodeComponentTypeMap ? I[T][K]['list'] : never

// TODO: Make async
export type DataInterface<I extends NodeInterface<NodeCategory>> = {
  getParameter: (key: string) => Value<undefined, 'array' | 'single'>
  getTokenAttribute: (key: string) => Value<undefined, 'array' | 'single'>
  getCollectionAttribute: (key: string) => Value<undefined, 'array' | 'single'>
  getMetadata: <K extends 'id' | 'name' | 'description'>(
    key: K,
  ) => Value<
    K extends 'id' ? 'number' : 'string',
    K extends 'id' ? 'single' : 'single'
  >
  getInputValue: <K extends keyof I['inputs']>(
    key: K,
  ) => InferredValue<I, 'inputs', K>
  getControlValue: <K extends keyof I['controls']>(
    key: K,
  ) => InferredValue<I, 'controls', K>
}

export type ExecutionInterface<I extends NodeInterface<NodeCategory>> =
  DataInterface<I> & {
    revert: () => void
    setTokenAttribute: (
      key: string,
      value: Value<undefined, 'array' | 'single'>,
    ) => { previous: string; changed: boolean }
    setCollectionAttribute: (
      key: string,
      value: Value<undefined, 'array' | 'single'>,
    ) => { previous: string; changed: boolean }
    setMetadata: (
      key: 'name' | 'description',
      value: string,
    ) => { previous: string; changed: boolean }
  }

// ----------- NODE LOGIC -------------

export type NodeContext = EngineContext & {
  nodeId: string
}

export type ExecutionNodeOutput<I extends NodeInterface<NodeCategory>> =
  I['forwards'] extends string[]
    ? {
        log: { message: string }
        forward: I['forwards'][number]
      }
    : {
        log: { message: string }
      }

export type NodeExecution<I extends NodeInterface<NodeCategory>> = (
  state: ExecutionInterface<I>,
  context: NodeContext,
) => ExecutionNodeOutput<I> | Promise<ExecutionNodeOutput<I>>

export type DynamicNodeData<I extends NodeInterface<NodeCategory>> = <
  K extends keyof I['outputs'],
>(
  key: K,
  state: DataInterface<I>,
  context: NodeContext,
) => InferredValue<I, 'outputs', K> | Promise<InferredValue<I, 'outputs', K>>

export type StaticNodeData<I extends NodeInterface<NodeCategory>> = {
  [K in keyof I['outputs']]: (
    state: DataInterface<I>,
    context: NodeContext,
  ) => InferredValue<I, 'outputs', K> | Promise<InferredValue<I, 'outputs', K>>
}

export type RootNodeFunction<I extends NodeInterface<NodeCategory>> = (
  state: DataInterface<I>,
  context: NodeContext,
) => InferredRootValue<I> | Promise<InferredRootValue<I>>

export type NodeData<I extends NodeInterface<NodeCategory>> =
  | StaticNodeData<I>
  | DynamicNodeData<I>

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
