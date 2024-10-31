import type { BaseSchemes, NodeId } from 'rete'
import intersects from 'intersects'
// @ts-ignore
import decomp from 'poly-decomp'
import './multi-selector.css'
import type { Position } from '@/types/nodes.types'
import type {
  EditorMode,
  EditorModeOptions,
  Intersect,
  Shape,
  Area,
} from '@/types/editor.types'
import { isHotkeyPressed } from 'react-hotkeys-hook'

function screenToEditorCoordinates(
  point: Position,
  position: Position,
  zoom: number,
) {
  return {
    x: (point.x - position.x) / zoom,
    y: (point.y - position.y) / zoom,
  }
}

function getPoint(event: PointerEvent, container: HTMLElement) {
  const rect = container.getBoundingClientRect()

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

const options: {
  [key in EditorMode]: EditorModeOptions
} = {
  select: {
    button: 0,
    intersect: 'full',
  },
  drag: {
    button: null,
    intersect: 'full',
  },
}

export function addMultiSelector<S extends BaseSchemes, K>(
  area: Area,
  mode: EditorMode,
  shape: Shape,
  selected: (ids: NodeId[]) => unknown,
) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const lasso = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polygon',
  )
  const { container } = area
  let currentButton = options[mode].button
  let currentIntersect = options[mode].intersect
  let currentShape = shape

  svg.appendChild(lasso)
  svg.setAttribute('id', 'lasso')
  container.appendChild(svg)

  const { left, top } = container.getBoundingClientRect()

  svg.style.width = '100%'
  svg.style.height = '100%'

  /*   svg.style.width = `calc(100% - ${left}px)`;
  svg.style.height = `calc(100% - ${top}px)`;
  svg.style.transform = `translate(${left}px, ${top}px)`; */

  let points: { x: number; y: number }[] = []
  let isActive = false

  container.addEventListener('pointerdown', start)
  container.addEventListener('pointermove', move)
  container.addEventListener('pointerup', up)

  function start(event: PointerEvent) {
    if (event.button !== currentButton || event.pointerType !== 'mouse') return
    if (isHotkeyPressed('space')) return

    if (window.innerWidth < 768) return

    isActive = true

    points = [getPoint(event, container)]
    updatePolygon()
  }

  function move(event: any) {
    if (!isActive || event.pointerType !== 'mouse') return

    if (currentShape === 'lasso') {
      points.push(getPoint(event, container))
    } else {
      const first = points[0]
      const current = getPoint(event, container)

      if (!first || !current) return

      points = [
        first,
        { x: first.x, y: current.y },
        current,
        { x: current.x, y: first.y },
      ]
    }
    updatePolygon()
  }

  function intersectNodes(points: Position[]) {
    const { k } = area.area.transform
    const decompPoints = points.map((point) => [point.x, point.y])

    decomp.makeCCW(decompPoints)

    const polygons = (
      decomp.quickDecomp(decompPoints) as [number, number][][]
    ).map((polygon) => polygon.flat())

    const nodes = Array.from(area.nodeViews.entries()).map(([id, view]) => {
      const rect = view.element.getBoundingClientRect()
      const { x, y } = view.position
      const width = rect.width / k
      const height = rect.height / k

      return { id, x, y, width, height }
    })

    const selectedNodes = nodes.filter(({ x, y, width, height }) => {
      return polygons.some((points) =>
        currentIntersect === 'full'
          ? intersects.polygonBox(points, x, y, width, height)
          : intersects.polygonCircle(points, x + width / 2, y + height / 2, 10),
      )
    })

    return selectedNodes
  }

  function up() {
    const { x, y, k } = area.area.transform
    const editorPoints = points.map((point) =>
      screenToEditorCoordinates(point, { x, y }, k),
    )

    if (editorPoints.length >= 3) {
      const nodes = intersectNodes(editorPoints)
      selected(nodes.map(({ id }) => id))
    }

    isActive = false
    points = []
    updatePolygon()
  }

  function updatePolygon() {
    const pointString = points.map((point) => `${point.x},${point.y}`).join(' ')
    lasso.setAttribute('points', pointString)
  }

  return {
    setIntersect(intersect: Intersect) {
      currentIntersect = intersect
    },
    setShape(shape: Shape) {
      currentShape = shape
    },
    setButton(button: number | null) {
      currentButton = button
    },
    setOptions(mode: EditorMode) {
      currentIntersect = options[mode].intersect
      currentButton = options[mode].button
    },
    destroy: () => {
      container.removeEventListener('pointerdown', start)
      container.removeEventListener('pointermove', move)
      container.removeEventListener('pointerup', up)
    },
  }
}
