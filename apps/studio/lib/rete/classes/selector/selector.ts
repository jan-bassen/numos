import type { Area, Position, SelectableType } from '@/types/nodes.types'
import type { NodeEditor } from '../editor'
import { debounce, isEqual } from 'lodash'

export class Selector {
  selectedNodes: string[] = []
  pickId: string | null = null
  onSelectionChange?: (selection: string[]) => void
  context: { editor: NodeEditor; area: Area }
  nodePositionSaveMap: Map<
    string,
    _.DebouncedFunc<(id: string, position: Position) => void>
  >
  constructor(
    editor: NodeEditor,
    public area: Area,
    accumulator: { active(): boolean; destroy(): void },
    onSelectionChange?: (selection: string[]) => void,
  ) {
    this.onSelectionChange = onSelectionChange
    this.context = { editor, area }
    let twitch: null | number = 0
    this.nodePositionSaveMap = new Map()

    area.addPipe(async (context) => {
      if (context.type === 'nodepicked') {
        const pickedId = context.data.id
        twitch = null
        if (this.isSelected('node', pickedId)) return context
        const accumulate = accumulator.active()
        this.selectNode(pickedId, accumulate)
        this.onSelectionChange?.(this.selectedNodes)
        return context
      }
      if (context.type === 'nodetranslated') {
        const { id, position, previous, excludeSelection } = context.data
        const dx = position.x - previous.x
        const dy = position.y - previous.y

        if (this.isSelected('node', id) && !excludeSelection) {
          await this.translateSelectedNodes(id, dx, dy)
        }
      } else if (context.type === 'pointerdown') {
        twitch = 0
      } else if (context.type === 'pointermove') {
        if (twitch !== null) twitch++
      } else if (context.type === 'pointerup') {
        if (twitch !== null && twitch < 4) {
          this.unselectAllNodes()
        }
        twitch = null
      }
      return context
    })
  }

  setSelectedNodes(ids: string[]) {
    const previous = this.selectedNodes
    this.selectedNodes = ids
    for (const id of [...previous, ...ids]) {
      this.area.update('node', id)
    }
    this.onSelectionChange?.(this.selectedNodes)
  }

  selected(ids: string[]) {
    const oldIds = this.selectedNodes
    if (isEqual(ids, oldIds)) return
    const [first, ...rest] = ids
    this.unselectAllNodes()
    if (first) {
      this.selectNode(first, false)
    }
    for (const id of rest) {
      this.selectNode(id, true)
    }
    this.onSelectionChange?.(this.selectedNodes)
  }

  isSelected(type: SelectableType, id: string) {
    switch (type) {
      case 'node':
        return this.selectedNodes.includes(id)
    }
  }

  selectNode(id: string, accumulate: boolean) {
    if (this.isSelected('node', id)) return
    if (!accumulate) {
      const previous = this.selectedNodes
      this.unselectAllNodes()
      for (const id of previous) {
        this.area.update('node', id)
      }
    }
    this.selectedNodes.push(id)
    this.area.update('node', id)
    /* const node = this.context.editor.getNode(id)
    if (node && !node.selected) {
      node.selected = true
      this.context.area.update('node', node.id)
    } */
  }

  unselectNode(id: string) {
    if (!this.isSelected('node', id)) return
    this.selectedNodes = this.selectedNodes.filter((node) => node !== id)
    this.area.update('node', id)
    /*     const node = this.context.editor.getNode(id)
    if (node?.selected) {
      node.selected = false
      this.context.area.update('node', node.id)
    } */
  }

  unselectAllNodes() {
    if (this.selectedNodes.length === 0) return
    const previous = this.selectedNodes
    this.selectedNodes = []
    for (const id of previous) {
      this.area.update('node', id)
    }
    this.onSelectionChange?.(this.selectedNodes)
  }

  async saveNodePosition(id: string) {
    const newPosition = this.context.area.nodeViews.get(id)?.position

    if (newPosition) {
      let debouncedFunc = this.nodePositionSaveMap.get(id)
      if (!debouncedFunc) {
        debouncedFunc = debounce((nodeId, position) => {
          this.context.editor.events.onNodeMoved?.(
            this.context.editor,
            nodeId,
            position,
          )
        }, 1000)
        this.nodePositionSaveMap.set(id, debouncedFunc)
      }

      debouncedFunc(id, newPosition)
    }
  }

  async translateSelectedNodes(pickedId: string, dx: number, dy: number) {
    // TODO: find a better way to save multiple nodes at once
    for (const id of this.selectedNodes) {
      this.saveNodePosition(id)
      if (id === pickedId) continue
      const view = this.context.area.nodeViews.get(id)
      const current = view?.position
      if (current) {
        const newPosition = { x: current.x + dx, y: current.y + dy }
        view.position = newPosition
        view.element.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`
        this.context.area.update('node', id)
      }
    }
  }
}
