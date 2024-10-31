import type { Position } from '@/types/nodes.types'
import type { InputMode } from '@/types/editor.types'

/**
 * Zoom source
 */
export type ZoomSource = 'wheel' | 'touch' | 'dblclick'
export type OnZoom = (
  delta: number,
  ox: number,
  oy: number,
  source?: ZoomSource,
) => void
export type ZoomEvents = {
  zoom: OnZoom
  translate: (x: number, y: number) => void
}
type ZoomConfig = {
  getCurrentPosition: () => Position
}

/**
 * Zoom class, used to handle zooming of the area. Can be extended to add custom behavior.
 * @internal
 */
export class Zoom {
  previous: { cx: number; cy: number; distance: number } | null = null
  pointers: PointerEvent[] = []
  private container!: HTMLElement
  private element!: HTMLElement
  private config!: ZoomConfig
  private events!: ZoomEvents
  private inputMode: InputMode = 'mouse'

  constructor(private intensity: number) {}

  public initialize(
    container: HTMLElement,
    element: HTMLElement,
    config: ZoomConfig,
    events: ZoomEvents,
  ) {
    this.container = container
    this.element = element
    this.config = config
    this.events = events
    this.container.addEventListener('wheel', this.wheel, { passive: false })
    this.container.addEventListener('pointerdown', this.down)
    this.container.addEventListener('dblclick', this.dblclick)

    window.addEventListener('pointermove', this.move)
    window.addEventListener('pointerup', this.up)
    window.addEventListener('pointercancel', this.up)
  }

  public setInputMode(mode: InputMode) {
    this.inputMode = mode
  }

  private wheel = (e: WheelEvent) => {
    e.preventDefault()
    if (e.deltaY === 0) return
    if (this.inputMode === 'mouse') this.mouseWheel(e)
    if (this.inputMode === 'touchpad') this.touchpadWheel(e)
  }

  private mouseWheel = (e: WheelEvent) => {
    e.preventDefault()
    const { left, top } = this.element.getBoundingClientRect()
    const isNegative = e.deltaY < 0
    const delta = isNegative ? this.intensity : -this.intensity
    const ox = (left - e.clientX) * delta
    const oy = (top - e.clientY) * delta
    this.events.zoom(delta, ox, oy, 'wheel')
  }

  private touchpadWheel = (e: WheelEvent) => {
    e.preventDefault()
    const zoomSensitivity = 0.3
    const panSensitivity = 1.5

    if (e.ctrlKey) {
      const { left, top } = this.element.getBoundingClientRect()
      const isNegative = e.deltaY < 0
      const delta = isNegative
        ? this.intensity * zoomSensitivity
        : -this.intensity * zoomSensitivity
      const ox = (left - e.clientX) * delta
      const oy = (top - e.clientY) * delta

      this.events.zoom(delta, ox, oy, 'wheel')
    } else {
      const dx = e.deltaX * panSensitivity * -1
      const dy = e.deltaY * panSensitivity * -1
      const current = this.config.getCurrentPosition()
      this.events.translate(current.x + dx, current.y + dy)
    }
  }

  private getTouches() {
    const e = { touches: this.pointers }
    const t1 = e.touches[0]
    const t2 = e.touches[1]
    if (!t1 || !t2) throw new Error('Touch event not found')
    const [x1, y1] = [t1.clientX, t1.clientY]
    const [x2, y2] = [t2.clientX, t2.clientY]

    const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

    return {
      cx: (x1 + x2) / 2,
      cy: (y1 + y2) / 2,
      distance,
    }
  }

  private down = (e: PointerEvent) => {
    this.pointers.push(e)
  }

  private move = (e: PointerEvent) => {
    this.pointers = this.pointers.map((p) =>
      p.pointerId === e.pointerId ? e : p,
    )
    if (!this.isTranslating()) return

    const { left, top } = this.element.getBoundingClientRect()
    const { cx, cy, distance } = this.getTouches()

    if (this.previous !== null) {
      const delta = distance / this.previous.distance - 1

      const ox = (left - cx) * delta
      const oy = (top - cy) * delta

      this.events.zoom(
        delta,
        ox - (this.previous.cx - cx),
        oy - (this.previous.cy - cy),
        'touch',
      )
    }
    this.previous = { cx, cy, distance }
  }

  private up = (e: PointerEvent) => {
    this.previous = null
    this.pointers = this.pointers.filter((p) => p.pointerId !== e.pointerId)
  }

  private dblclick = (e: MouseEvent) => {
    e.preventDefault()

    const { left, top } = this.element.getBoundingClientRect()
    const delta = 4 * this.intensity

    const ox = (left - e.clientX) * delta
    const oy = (top - e.clientY) * delta

    this.events.zoom(delta, ox, oy, 'dblclick')
  }

  public isTranslating() {
    // is translating while zoom (works on multitouch)
    return this.pointers.length >= 2
  }

  public destroy() {
    this.container.removeEventListener('wheel', this.wheel)
    this.container.removeEventListener('pointerdown', this.down)
    this.container.removeEventListener('dblclick', this.dblclick)

    window.removeEventListener('pointermove', this.move)
    window.removeEventListener('pointerup', this.up)
    window.removeEventListener('pointercancel', this.up)
  }
}
