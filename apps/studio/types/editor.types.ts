import type { Action, Attribute, ReturnInfo, LayerTree } from './database.types'
import type { Connection } from '@/lib/rete/classes/connection'
import type { Node } from '@/lib/rete/classes/node'
import type { ContextMenuExtra } from 'rete-context-menu-plugin'
import type { AreaPlugin } from '@/lib/rete/classes/area/area-plugin'
import type { HistoryPlugin } from '@/lib/rete/classes/history/plugin'
import type { HistoryActions } from '@/lib/rete/classes/history/load-actions'
import type { NodeType } from '@repo/engine/types/node-types'
import type { NodeDefinitions, Position, SocketSide } from './nodes.types'
import type { NodeEditor } from '@/lib/rete/classes/editor'
import type {
  SavedConnection,
  OLDSavedControlMap,
  SavedNode,
} from '@repo/engine/types/graph-types'
import type { ZoomEventParams } from '@/lib/rete/classes/area/area'
import type { ParameterInfo } from './actions.types'
import type { ClassicPreset as Classic, GetSchemes, NodeId } from 'rete'
import type {
  ReactArea2D,
  RenderEmit as RenderEmitBase,
} from 'rete-react-plugin'

// ----------- EDITOR -------------

export type Schemes = GetSchemes<Node, Connection>
export type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra
export type Area = AreaPlugin
export type History = HistoryPlugin<Schemes, HistoryActions>

export type RenderEmit = RenderEmitBase<Schemes>

export type Graph = {
  nodes: Node[]
  connections: Connection[]
}

export type EditorType = 'image' | 'action'

export type EditorContext = {
  type: EditorType
  attributes: Attribute[]
  parameters?: ParameterInfo[]
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

// ----------- EDITOR CONFIG -------------

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
  type: 'data' | 'execution'
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
  onRootNodeChanged?: (editor: NodeEditor, controls: OLDSavedControlMap) => void
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

// ----------- SELECTION -------------

export type Intersect = 'full' | 'center'
export type Shape = 'lasso' | 'marquee'

export type EditorModeOptions = {
  button: number | null
  intersect: Intersect
}

export type SelectorEntity = {
  label: string
  id: string
  unselect(): void
  translate(dx: number, dy: number): void
}

export type SelectableType = 'node' | 'connection'
