import type { RenderEmit } from 'rete-react-plugin'
import type { Node } from '@/lib/rete/classes/node'
import type { Control } from '@/lib/rete/classes/control'
import type { NodeEditor } from '@/lib/rete/classes/editor'
import type {
  AnyNode,
  InferredControlList,
  InferredControlType,
  InferredSocketList,
  InferredSocketType,
  NodeCategory,
  NodeInterface,
  NodeType,
} from '@repo/engine/types/node-types'
import type {
  OptionalDataType,
  OptionalValueType,
  Value,
  ValueSettings,
  ValueType,
} from '@repo/engine/types/value-types'
import type { Area, Schemes } from './editor.types'
import type { ActionTrigger, ParameterInfo } from './actions.types'
import type { AttributeInfo } from './attributes.types'
import type { Input } from '@/lib/rete/classes/connectors/input'
import type { Output } from '@/lib/rete/classes/connectors/output'

// ----------- NODE DEPENDENCIES -------------

export type NodeDependency = {
  element: 'attribute'
  nodes: {
    nodeType: NodeType
    controls: string[]
  }[]
}

// ----------- NODE PART DEFINITIONS -------------

export type SocketSide = 'input' | 'output'

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

export type ControlDefinition<
  I extends NodeInterface<NodeCategory>,
  K extends keyof I['controls'],
> = {
  index?: number
  key: K
  label?: string
  state?: string
  type: InferredControlType<I, K>
  list?: InferredControlList<I, K>
  settings?: ValueSettings<InferredControlType<I, K>>
  placeholder?: string
  onChange?: (
    node: NodeInteractionInterface<I>,
    value: Value<
      InferredControlType<I, K>,
      InferredControlList<I, K> extends true
        ? 'objectarray'
        : InferredControlList<I, K> extends false
          ? 'single'
          : 'single' | 'objectarray',
      true
    >,
  ) => void
  readonly?: boolean
}

export type AnyControlDefinition = ControlDefinition<AnyNode, string>

export type DataSocketDefinition<
  I extends NodeInterface<NodeCategory>,
  T extends 'inputs' | 'outputs',
  K extends keyof I[T],
> = {
  index?: number
  type?: InferredSocketType<I, T, K>
  list?: InferredSocketList<I, T, K>
  canBeList?: boolean
  key: K
  settings?: ValueSettings<InferredSocketType<I, T, K>>
  state?: string
  label: string
  multipleConnections?: boolean
  hideControl?: boolean
  dividerAfter?: boolean
  control?: ControlDefinition<any, any> //TODO: Make typesafe
  compatibleWith?: OptionalDataType[]
  onConnect?: (node: NodeInteractionInterface<I>) => void
  onDisconnect?: (node: NodeInteractionInterface<I>) => void
}

export type ExecSocketDefinition = { key: string; label: string }

export type AnyDataSocketDefinition<
  Side extends 'inputs' | 'outputs' = 'inputs' | 'outputs',
> = DataSocketDefinition<AnyNode, Side, string>

/* export type SpecificDynamicInputsDefinition<
  I extends NodeInterface<NodeCategory>,
> =
  | SpecificSocketDefinition<I, 'inputs', keyof I['inputs']>[]
  | ((
      state: DefinitionInterface<I>,
    ) => SpecificSocketDefinition<I, 'inputs', keyof I['inputs']>[])

export type DynamicInputsDefinition = SpecificDynamicInputsDefinition<AnyNode>

export type SpecificDynamicOutputsDefinition<
  I extends NodeInterface<NodeCategory>,
> =
  | SpecificSocketDefinition<I, 'outputs', keyof I['outputs']>[]
  | ((
      state: DefinitionInterface<I>,
    ) => SpecificSocketDefinition<I, 'outputs', keyof I['outputs']>[]) 

export type DynamicOutputsDefinition = SpecificDynamicOutputsDefinition<AnyNode> */

export type SpecificDynamicSocketsDefinition<
  I extends NodeInterface<NodeCategory>,
  Side extends 'inputs' | 'outputs' = 'inputs' | 'outputs',
> =
  | DataSocketDefinition<I, Side, keyof I[Side]>[]
  | ((
      state: DefinitionInterface<I>,
    ) => DataSocketDefinition<I, Side, keyof I[Side]>[])

export type DynamicSocketsDefinition<
  Side extends 'inputs' | 'outputs' = 'inputs' | 'outputs',
> = SpecificDynamicSocketsDefinition<AnyNode, Side>

export type SpecificDynamicControlsDefinition<
  I extends NodeInterface<NodeCategory>,
> =
  | ControlDefinition<I, keyof I['controls']>[]
  | ((
      state: DefinitionInterface<I>,
    ) => ControlDefinition<I, keyof I['controls']>[])

export type DynamicControlsDefinition =
  SpecificDynamicControlsDefinition<AnyNode>

// ----------- NODE INTERFACES -------------

export type NodeInfo = {
  description: string
  example?: string
  graphic?: string
  link?: string
}

export type NodeInteractionInterface<I extends NodeInterface<NodeCategory>> = {
  updateInputs: () => void
  updateOutputs: () => void
  updateControls: () => void
  updateControl: <K extends keyof I['controls']>(
    key: K,
    value: Value<
      InferredControlType<I, K>,
      InferredControlList<I, K> extends true
        ? 'objectarray'
        : InferredControlList<I, K> extends false
          ? 'single'
          : 'single' | 'objectarray',
      true
    >,
  ) => void
}

export type DefinitionInterface<I extends NodeInterface<NodeCategory>> = {
  getConnectedInputKeys: () => Array<keyof I['inputs']>
  getInfoFromInputConnection: (key: keyof I['inputs']) =>
    | {
        type: ValueType
        list: boolean
        settings?: ValueSettings
      }
    | undefined
  getInfoFromInputConnections: (keys: Array<keyof I['inputs']>) =>
    | {
        type: ValueType
        list: boolean
        settings?: ValueSettings
      }
    | undefined
  getControlValue: <K extends keyof I['controls']>(
    key: K,
  ) => Value<
    InferredControlType<I, K>,
    InferredControlList<I, K> extends true
      ? 'objectarray'
      : InferredControlList<I, K> extends false
        ? 'single'
        : 'single' | 'objectarray',
    true
  >
  getParameter: (key: string) => ParameterInfo | undefined
  getParameters: () => ParameterInfo[] | undefined
  getTrigger: () => ActionTrigger | undefined
  getTokenAttribute: (key: string) => AttributeInfo | undefined
  getTokenAttributes: () => AttributeInfo[] | undefined
  getCollectionAttribute: (key: string) => AttributeInfo | undefined
  getCollectionAttributes: () => AttributeInfo[] | undefined
}

// ----------- NODE DEFINITION -------------

export type SpecificNodeDefinition<I extends NodeInterface<NodeCategory>> = {
  type: I['type']
  root?: I['root']
  category: I['category']
  componentType?: NodeComponentType
  title: string
  nodeInfo: NodeInfo
  forwards?: I['forwards'] extends string[]
    ? ExecSocketDefinition[]
    :
        | never
        | (['forwards'] extends never
            ? never
            : (
                node: Node,
              ) => I['forwards'] extends string[]
                ? ExecSocketDefinition[]
                : never)
  inputs?: SpecificDynamicSocketsDefinition<I, 'inputs'>
  outputs?: SpecificDynamicSocketsDefinition<I, 'outputs'>
  controls?: SpecificDynamicControlsDefinition<I>
}

export type NodeDefinition = SpecificNodeDefinition<AnyNode>

export type NodeDefinitions = Record<NodeType, NodeDefinition>

export type Position = { x: number; y: number }

// TODO: REMOVE?!
export type NodeContext = {
  editor: NodeEditor
  area: Area
}

// ----------- NODE COMPONENTS -------------

export type NodeComponentType = 'input' | 'generic'

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
