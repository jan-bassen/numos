import type {
  NodeResizeEventParams,
  NodeTranslateEventParams,
} from 'rete-area-plugin/_types/node-view'
import type { Drag } from './area/drag'
import { BaseNodeView } from './area/base-node-view'

type Events = {
  picked: () => void
  translated: (params: NodeTranslateEventParams) => Promise<unknown | boolean>
  dragged: () => void
  contextmenu: (event: MouseEvent) => void
  resized: (params: NodeResizeEventParams) => Promise<unknown | boolean>
}
type Guards = {
  resize: (params: NodeResizeEventParams) => Promise<unknown | boolean>
  translate: (params: NodeTranslateEventParams) => Promise<unknown | boolean>
}

export class NodeView extends BaseNodeView {
  private getZoomPublic: () => number
  private eventsPublic: Events

  constructor(
    nodeId: string,
    getZoom: () => number,
    events: Events,
    guards: Guards,
  ) {
    super(nodeId, getZoom, events, guards)
    this.getZoomPublic = getZoom
    this.eventsPublic = events
  }

  setDragHandler(newDragHandler: Drag): void {
    if (this.dragHandler) this.dragHandler.destroy()
    this.dragHandler = newDragHandler
    if (!this.dragHandler) return
    this.dragHandler.initialize(
      this.element,
      {
        getCurrentPosition: () => this.position,
        getZoom: () => this.getZoomPublic(),
      },
      {
        start: this.eventsPublic.picked,
        translate: this.translate,
        drag: this.eventsPublic.dragged,
      },
    )
  }
}
