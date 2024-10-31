import type {
  Area,
  Direction,
  EditorConfig,
  EditorContext,
  EditorEvents,
  EditorSettings,
  Graph,
  Item,
  MultiSelector,
  ResolvedEditorConfig,
  Schemes,
  History,
} from '@/types/editor.types'
import type {
  MapGraph,
  SavedGraph,
  MapGraphNode,
  SavedNode,
} from '@repo/engine/types/graph-types'
import { Node } from './node'
import { Connection } from './connection'
import { NodeEditor as BaseNodeEditor } from 'rete'
import { toast } from 'sonner'
import { getNodeMenuList, type NewNodePosition } from '../utils/init'
import {
  addBackground,
  updateBackground,
} from '@/components/node-editor/background'
import { Selector } from './selector/selector'
import { accumulateOnShift } from '../utils/presets'
import { addMultiSelector } from './selector/multi-selector'
import { isEqual } from 'lodash'
import { zoomAt } from './area/extensions/zoom-at'
import { Drag, dragModeDragGuards, selectModeDragGuards } from './area/drag'
import type { NodeType } from '@repo/engine/types/node-types'
import type { GraphErrorData } from '@repo/engine/types/engine-types'

export class NodeEditor extends BaseNodeEditor<Schemes> {
  configDef: EditorConfig
  config: ResolvedEditorConfig
  setupComplete = false
  nodelist: Item[]
  selector: Selector
  multiSelector: MultiSelector
  constructor(
    config: EditorConfig,
    public context: EditorContext,
    public events: EditorEvents,
    public settings: EditorSettings,
    public area: Area,
  ) {
    super()
    this.configDef = config
    this.context = context
    this.events = events
    this.area = area
    this.use(area)

    this.config = this.configDef(this.context)
    this.nodelist = getNodeMenuList(
      this.addNewNode,
      this,
      this.area,
      this.config,
    )
    addBackground(area, this.nodelist, this.settings.mode)

    this.selector = new Selector(
      this,
      area,
      accumulateOnShift(),
      events.onSelectionChanged,
    )

    this.multiSelector = addMultiSelector(
      area,
      this.settings.mode,
      this.settings.shape,
      (ids) => {
        const oldIds = this.selector.selectedNodes
        if (isEqual(ids, oldIds)) return
        const [first, ...rest] = ids
        this.selector.unselectAllNodes()
        if (first) {
          this.selector.selectNode(first, false)
        }
        for (const id of rest) {
          this.selector.selectNode(id, true)
        }
        this.selector.onSelectionChange?.(this.selector.selectedNodes)
      },
    )
    this.area.area.setDragHandler(
      new Drag(
        settings.mode === 'drag' ? dragModeDragGuards : selectModeDragGuards,
      ),
    )
    this.applySettings(settings)
  }

  applySettings(settings: EditorSettings) {
    this.settings = settings
    this.multiSelector.setOptions(this.settings.mode)
    this.multiSelector.setShape(this.settings.shape)
    updateBackground(this.area, this.nodelist, this.settings.mode)
    this.area.area.dragHandler?.setGuards(
      settings.mode === 'drag' ? dragModeDragGuards : selectModeDragGuards,
    )
    this.area.area.zoomHandler?.setInputMode(this.settings.input)
  }

  trigger(error: GraphErrorData) {
    const node = this.getNode(error.location.node)
    if (!node) {
      return
    }
    node.triggerError(error)
  }

  clearError(nodeId: string) {
    const node = this.getNode(nodeId)
    if (!node) {
      return
    }
    node.clearError()
  }

  async updateConfig() {
    const newConfig = this.configDef(this.context)

    const newNodelist = getNodeMenuList(
      this.addNewNode,
      this,
      this.area,
      newConfig,
    )
    const nodesToRemove = this.getNodes().filter((node) =>
      newConfig.blocklist.includes(node.definition.type),
    )
    for (const node of nodesToRemove) {
      await this.removeNode(node.id)
    }
    if (nodesToRemove.length > 0) {
      toast.warning(`Removed ${nodesToRemove.length} nodes from the editor.`)
    }
    updateBackground(this.area, newNodelist, this.settings.mode)
    this.config = newConfig
    this.nodelist = newNodelist
  }

  updateContext(context: EditorContext) {
    this.context = context
    this.updateConfig()
  }

  getGraph = () => {
    const nodes = this.getNodes()
    const connections = this.getConnections()
    const serializedNodes = nodes.map((node) => node.save())
    const serializedConnections = connections.map((conn) => conn.serialize())

    return {
      nodes: serializedNodes,
      connections: serializedConnections,
    }
  }

  getNodemap = () => {
    const nodeMap: MapGraph = {}
    for (const node of this.getNodes()) {
      const savedMapNode = node.saveToMap()
      nodeMap[node.id] = savedMapNode
    }
    return nodeMap
  }

  importGraph = async (
    graph: SavedGraph,
    area: Area,
    history: History,
    reset = false,
  ) => {
    if (reset) {
      await this.clear()
    }
    for (const node of graph.nodes) {
      const def = this.config.nodes[node.type]
      if (!def) {
        toast.error(`Node type ${node.type} not found`)
        continue
      }

      const newNode = new Node(def, { area: area, editor: this }, node)
      await this.addNode(newNode)
    }

    let removedConnections = 0
    for (const savedConnection of graph.connections) {
      const source = this.getNode(savedConnection.source)
      const target = this.getNode(savedConnection.target)
      if (
        !source ||
        !source.getOutput(savedConnection.sourceOutput) ||
        !target ||
        !target.getInput(savedConnection.targetInput)
      ) {
        removedConnections++
        this.events.onConnectionRemoved?.(this, savedConnection.id)
        continue
      }
      try {
        const connection = new Connection(
          this,
          source,
          savedConnection.sourceOutput,
          target,
          savedConnection.targetInput,
          savedConnection.id,
        )
        await this.addConnection(connection)
      } catch (e) {
        removedConnections++
        this.events.onConnectionRemoved?.(this, savedConnection.id)
      }
    }

    if (removedConnections > 0) {
      toast.error(`Removed ${removedConnections} invalid connections`)
    }

    setTimeout(() => {
      zoomAt(area, this.getNodes())
      history.clear()
    }, 100)
    this.setupComplete = true
  }

  duplicateNode = async (nodeId: string) => {
    const node = this.getNode(nodeId)
    if (!node) {
      return
    }
    const newNode = await node.duplicate()
    return newNode
  }

  duplicateNodes = async (nodeIds: string[]) => {
    const newNodes: string[] = []
    for (const nodeId of nodeIds) {
      const newNode = await this.duplicateNode(nodeId)
      if (newNode) newNodes.push(newNode)
    }
    return newNodes
  }

  duplicateSelection = async () => {
    const selectedNodes = this.selector.selectedNodes
    if (selectedNodes.length === 0) return
    const newNodes = await this.duplicateNodes(selectedNodes)
    if (newNodes.length === 0) return
    this.selector.setSelectedNodes(newNodes)
  }

  moveNode = (
    area: Area,
    node: string,
    length: number,
    direction: Direction,
  ) => {
    const currentPosition = area.nodeViews.get(node)?.position
    if (!currentPosition) return
    switch (direction) {
      case 'up':
        area.translate(node, {
          x: currentPosition.x,
          y: currentPosition.y - length,
        })
        break
      case 'down':
        area.translate(node, {
          x: currentPosition.x,
          y: currentPosition.y + length,
        })
        break
      case 'left':
        area.translate(node, {
          x: currentPosition.x - length,
          y: currentPosition.y,
        })
        break
      case 'right':
        area.translate(node, {
          x: currentPosition.x + length,
          y: currentPosition.y,
        })
        break
    }
  }

  removeSingleNode = async (node: string) => {
    if (this.getNode(node)?.definition.root) return
    const connections = this.getConnections().filter(
      (c) => c.source === node || c.target === node,
    )
    for (const connection of connections) {
      await this.removeConnection(connection.id)
    }
    await this.removeNode(node)
  }

  removeMultipleNodes = async (nodes: string[]) => {
    let nodesToRemove = nodes
    const allConnections = this.getConnections()
    const connectionsToRemove: string[] = []
    for (const node of nodes) {
      if (this.getNode(node)?.definition.root) {
        nodesToRemove = nodesToRemove.filter((n) => n !== node)
        continue
      }
      const connections = allConnections.filter(
        (c) => c.source === node || c.target === node,
      )
      for (const connection of connections) {
        if (!connectionsToRemove.includes(connection.id))
          connectionsToRemove.push(connection.id)
      }
    }
    for (const connection of connectionsToRemove) {
      await this.removeConnection(connection)
    }
    for (const node of nodesToRemove) {
      await this.removeNode(node)
    }
  }

  clearEditor = () => {
    this.getNodes().map((n) => this.removeNode(n.id))
    this.getConnections().map((c) => this.removeConnection(c.id))
  }

  addNewNode = async (type: NodeType, position: NewNodePosition) => {
    const config = this.config.nodes[type]
    if (!config) throw new Error('Node type not found')
    const node = new Node(
      config,
      { area: this.area, editor: this },
      undefined,
      position === 'center'
        ? this.area.area.getCenter()
        : this.area.area.pointer,
    )
    await this.addNode(node)
  }

  addSavedNode = async (node: SavedNode) => {
    const config = this.config.nodes[node.type]
    if (!config) throw new Error('Node type not found')
    const newNode = new Node(
      config,
      {
        area: this.area,
        editor: this,
      },
      node,
    )
    await this.addNode(newNode)
  }

  clearAndSetGraph = async (graph: Graph) => {
    this.getNodes().map((n) => this.removeNode(n.id))
    this.getConnections().map((c) => this.removeConnection(c.id))
    for (const node of graph.nodes) {
      await this.addNode(node)
    }
    for (const connection of graph.connections) {
      await this.addConnection(connection)
    }
  }

  updateGraph = (area: Area) => {
    const nodes = this.getNodes()
    for (const node of nodes) {
      area.update('node', node.id)
    }
    for (const connection of this.getConnections()) {
      area.update('connection', connection.id)
    }
  }

  resetView = (area: Area) => {
    zoomAt(area, this.getNodes())
  }

  destroy = () => {
    this.area.destroy()
  }
}
