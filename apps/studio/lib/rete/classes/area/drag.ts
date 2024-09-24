import { isHotkeyPressed } from 'react-hotkeys-hook'
import type { Position } from 'rete-react-plugin'
import { type PointerListener, getPointerListener } from './utils'

type Events = {
  start: (e: PointerEvent) => void
  translate: (
    x: number,
    y: number,
    e: PointerEvent,
    excludeSelection?: boolean,
  ) => void
  drag: (e: PointerEvent) => void
}

type Guards = {
  down: (e: PointerEvent) => boolean
  move: (e: PointerEvent) => boolean
}

type DragConfig = {
  getCurrentPosition: () => Position
  getZoom: () => number
}

/**
 * Drag handler, used to handle dragging of the area and nodes. Can be extended to add custom behavior.
 */
export class Drag {
  public pointerStart?: Position
  public startPosition?: Position
  private pointerListener!: PointerListener
  public config!: DragConfig
  protected events!: Events
  protected guards: Guards

  constructor(guards?: Guards) {
    this.guards = guards || {
      down: (e) => !(e.pointerType === 'mouse' && e.button !== 0),
      move: () => true,
    }
  }

  public initialize(element: HTMLElement, config: DragConfig, events: Events) {
    this.config = config
    this.events = events
    element.style.touchAction = 'none'
    this.pointerListener = getPointerListener(element, {
      down: this.down,
      move: this.move,
      up: this.up,
    })
  }

  public setGuards(guards: Guards) {
    this.guards = guards
  }

  setStartPosition(position: Position) {
    this.startPosition = position
  }

  setPointerStart(position: Position) {
    this.pointerStart = position
  }

  private down = (e: PointerEvent) => {
    if (!this.guards.down(e)) return

    e.stopPropagation()
    this.pointerStart = { x: e.pageX, y: e.pageY }
    this.startPosition = { ...this.config.getCurrentPosition() }

    this.events.start(e)
  }

  private move = (e: PointerEvent) => {
    if (!this.pointerStart || !this.startPosition) return
    if (!this.guards.move(e)) return
    e.preventDefault()

    const delta = {
      x: e.pageX - this.pointerStart.x,
      y: e.pageY - this.pointerStart.y,
    }
    const zoom = this.config.getZoom()
    const x = this.startPosition.x + delta.x / zoom
    const y = this.startPosition.y + delta.y / zoom

    this.events.translate(x, y, e)
  }

  private up = (e: PointerEvent) => {
    if (!this.pointerStart) return

    this.pointerStart = undefined
    this.events.drag(e)
  }

  public destroy() {
    this.pointerListener.destroy()
  }
}

export const dragModeDragGuards: Guards = {
  down: (e) => {
    return e.pointerType !== 'mouse' || e.button === 0 || e.button === 1
  },
  move: () => true,
}

export const selectModeDragGuards: Guards = {
  down: (e) => {
    return (
      e.pointerType !== 'mouse' ||
      e.button === 1 ||
      (e.pointerType !== 'mouse' && e.button === 0)
    )
  },
  move: () => true,
}
