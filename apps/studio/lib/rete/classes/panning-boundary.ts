import type { NodeEditor } from './editor'
import type { Area } from '@/types/editor.types'

type PointerMove = {
  getEvent(): PointerEvent
  destroy(): void
}

type Props = {
  editor: NodeEditor
  intensity?: number
  padding?: number
}

type FrameWeight = {
  top: number
  bottom: number
  left: number
  right: number
}

export class PanningBoundary {
  editor: NodeEditor
  area: Area
  intensity: number
  padding: number
  pointermove: PointerMove
  tickerId: number | null = null

  constructor(props: Props) {
    this.editor = props.editor
    this.area = props.editor.area
    this.intensity = props.intensity || 2
    this.padding = props.padding || 30
    this.pointermove = this.watchPointerMove()
    this.area.addPipe((context) => {
      if (context.type === 'nodepicked') this.start()
      if (context.type === 'nodedragged') this.stop()
      return context
    })
  }

  getWeight(value: number, padding: number) {
    return Math.min(1, -Math.min(0, value / padding - 1))
  }

  getFrameWeight(x: number, y: number): FrameWeight {
    const frame = this.area.container.getBoundingClientRect()
    const top = this.getWeight(y - frame.top, this.padding)
    const bottom = this.getWeight(frame.bottom - y, this.padding)
    const left = this.getWeight(x - frame.left, this.padding)
    const right = this.getWeight(frame.right - x, this.padding)

    return {
      top,
      bottom,
      left,
      right,
    }
  }

  watchPointerMove() {
    let moveEvent: PointerEvent | null = null

    function pointermove(e: PointerEvent) {
      moveEvent = e
    }

    window.addEventListener('pointermove', pointermove)

    return {
      getEvent() {
        if (!moveEvent) throw new Error('no event captured')
        return moveEvent
      },
      destroy() {
        window.removeEventListener('pointermove', pointermove)
      },
    }
  }

  async translate() {
    const selector = this.editor.selector
    const { clientX, clientY, pageX, pageY } = this.pointermove.getEvent()
    const weights = this.getFrameWeight(clientX, clientY)
    const velocity = {
      x: (weights.left - weights.right) * this.intensity,
      y: (weights.top - weights.bottom) * this.intensity,
    }

    const pickedNode = this.editor
      .getNodes()
      .find((n) => selector.isSelected('node', n.id))

    const view = pickedNode && this.area.nodeViews.get(pickedNode.id)

    if (!view) return

    const { dragHandler, position } = view

    dragHandler.setPointerStart({
      x: pageX + velocity.x,
      y: pageY + velocity.y,
    })

    dragHandler.setStartPosition({
      ...dragHandler.config.getCurrentPosition(),
    })

    const { transform } = this.area.area
    const x = position.x - velocity.x / transform.k
    const y = position.y - velocity.y / transform.k

    await Promise.all([
      this.area.area.translate(
        transform.x + velocity.x,
        transform.y + velocity.y,
      ),
      this.area.translate(pickedNode.id, { x, y }),
    ])
  }

  start = () => {
    this.tickerId = requestAnimationFrame(async () => {
      try {
        await this.translate()
      } catch (e) {
        console.error(e)
      } finally {
        this.start()
      }
    })
  }

  stop = () => {
    if (!this.tickerId) return
    cancelAnimationFrame(this.tickerId)
  }

  destroy(): void {
    this.pointermove.destroy()
  }
}
