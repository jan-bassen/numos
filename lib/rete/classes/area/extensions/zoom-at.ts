import type { Area, Schemes } from '@/types/editor.types'
import type {
  NodeRef,
  SchemesWithSizes,
} from 'rete-area-plugin/_types/extensions/shared/types'
import { NodeEditor } from '../../editor'
import type { BaseAreaPlugin } from 'rete-area-plugin'
import type { NodeView } from '../../node-view'
import { getBoundingBox } from '../utils'

export function getNodesRect<S extends SchemesWithSizes, K>(
  nodes: S['Node'][],
  views: BaseAreaPlugin<S, K>['nodeViews'],
) {
  return nodes
    .map((node) => ({ view: views.get(node.id) as NodeView, node }))
    .filter((item) => item.view)
    .map(({ view, node }) => {
      const { width, height } = node

      if (typeof width !== 'undefined' && typeof height !== 'undefined') {
        return {
          position: view.position,
          width,
          height,
        }
      }

      return {
        position: view.position,
        width: view.element.clientWidth,
        height: view.element.clientHeight,
      }
    })
}

/**
 * Zoom extension parameters
 */
export type Params = {
  /** Set gap between nodes and the viewport border */
  scale?: number
}

/**
 * Zooms the area to fit the given nodes
 * @param plugin The area plugin
 * @param nodes The nodes to fit
 * @param params The zoom parameters
 */
// eslint-disable-next-line max-statements, max-len
export async function zoomAt(
  plugin: Area,
  nodes: NodeRef<Schemes>[],
  params?: Params,
) {
  const { scale = 0.9 } = params || {}
  const editor = plugin.parentScope<NodeEditor>(NodeEditor)
  const list = nodes
    .map((node) => (typeof node === 'object' ? node : editor.getNode(node)))
    .filter((node) => !!node)
  const rects = getNodesRect(list, plugin.nodeViews)
  const boundingBox = getBoundingBox(rects)
  const [w, h] = [plugin.container.clientWidth, plugin.container.clientHeight]
  const [kw, kh] = [w / boundingBox.width, h / boundingBox.height]
  const k = Math.min(kh * scale, kw * scale, 1)

  plugin.area.transform.x = w / 2 - boundingBox.center.x * k
  plugin.area.transform.y = h / 2 - boundingBox.center.y * k
  await plugin.area.zoom(k, 0, 0)
}
