import type { Node } from '../classes/node'
import type { Size } from 'rete-area-plugin/_types/types'
import type { Position } from 'rete-react-plugin'
import type { Input, Output } from 'rete/_types/presets/classic'
import type { Socket } from '../classes/socket'
import { Connection } from '../classes/connection'
import {
  type Area,
  Direction,
  Graph,
  NodeMap,
  type Schemes,
} from '@/types/nodes.types'
import { NodeView as BaseNodeView } from 'rete-area-plugin'
import type { NodeEditor } from '../classes/editor'
import { ta } from 'date-fns/locale'

export function getInnerRadius(size: Size) {
  const width = size.width
  const height = size.height
  const minLength = Math.min(width, height)

  return minLength / 2
}

export function checkElementIntersectPath(
  rect: Position & Size,
  pathElement: SVGPathElement,
  accuracy = 1,
) {
  const pathLength = pathElement.getTotalLength()
  const innerRectRadius = getInnerRadius(rect)
  const step = Math.max(pathLength / 100, innerRectRadius / accuracy)
  const pathRect = pathElement.getBBox()

  if (
    rect.x + rect.width < pathRect.x ||
    rect.x > pathRect.x + pathRect.width ||
    rect.y + rect.height < pathRect.y ||
    rect.y > pathRect.y + pathRect.height
  ) {
    return false
  }

  for (let i = 0; i < pathLength; i += step) {
    const point = pathElement.getPointAtLength(i)

    if (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    ) {
      return true
    }
  }

  return false
}

export function checkIntersection(
  position: Position,
  size: { width: number; height: number },
  connections: (readonly [string, HTMLElement])[],
): string[] {
  const paths = connections.map(([id, element]) => {
    const path = element.querySelector('path')

    if (!path) return

    return [id, element, path] as const
  })

  const ids: string[] = []
  for (const p of paths) {
    if (p === undefined) continue
    const [id, , path] = p
    if (checkElementIntersectPath({ ...position, ...size }, path)) {
      ids.push(id)
    }
  }

  return ids
}

type Props<S extends Schemes> = {
  createConnections: (
    node: S['Node'],
    connection: S['Connection'],
  ) => Promise<void>
}

async function replaceConnections(
  editor: NodeEditor,
  node: Node,
  connection: Connection,
) {
  const source = editor.getNode(connection.source)
  if (!source)
    throw new Error('Stranded connection! Source node for connection not found')

  const target = editor.getNode(connection.target)
  if (!target)
    throw new Error('Stranded connection! Target node for connection not found')

  const { sourceOutput, targetInput } = connection.resolveConnectionData()
  const fittingInputs: string[] = Object.entries(
    node.inputs as { [key: string]: Input<Socket> },
  )
    .filter(
      ([key, input]) =>
        sourceOutput && input.socket.isCompatibleWith(sourceOutput.socket),
    )
    .map(([key, input]) => key)

  const fittingOutputs: string[] = Object.entries(
    node.outputs as { [key: string]: Output<Socket> },
  )
    .filter(
      ([key, output]) =>
        targetInput && output.socket.isCompatibleWith(targetInput.socket),
    )
    .map(([key, output]) => key)

  if (fittingInputs[0] && fittingOutputs[0]) {
    await editor.removeConnection(connection.id)
    await editor.addConnection(
      new Connection(
        editor,
        source,
        connection.sourceOutput,
        node,
        fittingInputs[0],
      ),
    )
    /* source.updateOutputs(); */
    await editor.addConnection(
      new Connection(
        editor,
        node,
        fittingOutputs[0],
        target,
        connection.targetInput,
      ),
    )
    /* target.updateInputs(); */
  }
}

export function insertableNodes(editor: NodeEditor, area: Area) {
  area.addPipe(async (context) => {
    if (context.type === 'nodedragged') {
      const node = editor.getNode(context.data.id)
      if (!node) return context
      const view = area.nodeViews.get(context.data.id)
      const size = {
        width: view?.element.offsetWidth || 0,
        height: view?.element.offsetHeight || 0,
      }
      const cons = Array.from(area.connectionViews.entries()).map(
        ([id, view]) => [id, view.element] as const,
      )

      if (view) {
        const ids = checkIntersection(view.position, size, cons)
        if (ids.length > 0) {
          for (const id of ids) {
            const exist = editor.getConnection(id)
            if (!exist) continue
            if (exist.source !== node.id && exist.target !== node.id) {
              await replaceConnections(editor, node, exist)
            }
          }
        }
      }
    }
    return context
  })
}
