import type { Action } from '../plugin'
import type { Area } from '@/types/editor.types'
import type { Position } from '@/types/nodes.types'
import type { NodeEditor } from '@/lib/rete/classes/editor'
import type { Node } from '@/lib/rete/classes/node'
import type { SavedNode } from '@repo/shared/types/graph-types'

export class AddNodeAction implements Action {
  node?: Node
  position?: Position
  constructor(
    private editor: NodeEditor,
    private area: Area,
    private nodeId: string,
  ) {}

  async undo() {
    this.node = this.editor.getNode(this.nodeId)
    this.position = this.area.nodeViews.get(this.nodeId)?.position
    await this.editor.removeNode(this.nodeId)
  }

  async redo() {
    if (!this.node) return
    const node = {
      ...this.node.save(),
      x: this.position?.x || 0,
      y: this.position?.y || 0,
    }
    await this.editor.addSavedNode(node)
  }
}

export class RemoveNodeAction implements Action {
  constructor(
    private editor: NodeEditor,
    private node: SavedNode,
    private position: Position,
  ) {}

  async undo() {
    const node = { ...this.node, x: this.position.x, y: this.position.y }
    await this.editor.addSavedNode(node)
  }

  async redo() {
    await this.editor.removeNode(this.node.id)
  }
}

export class DragNodeAction implements Action {
  prev!: Position
  new!: Position

  constructor(
    private area: Area,
    public nodeId: string,
    prev: Position,
  ) {
    const view = area.nodeViews.get(nodeId)

    if (!view) return

    this.prev = { ...prev }
    this.new = { ...view.position }
  }

  async translate(position: Position) {
    const view = this.area.nodeViews.get(this.nodeId)

    if (!view) return

    await view.translate(position.x, position.y)
  }

  async undo() {
    await this.translate(this.prev)
  }

  async redo() {
    await this.translate(this.new)
  }
}
