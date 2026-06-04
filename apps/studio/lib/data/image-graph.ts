import type { ReturnInfo } from '@/types/database.types'
import type {
  SavedConnection,
  SavedGraph,
  SavedNode,
} from '@repo/shared/types/graph-types'
import { getAllBy, patch, put, remove } from './store'

type StoredImageNode = SavedNode & { layer: string }
type StoredImageConnection = SavedConnection & { layer: string }

export async function insertImageNode(
  node: SavedNode,
  layerId: string,
): Promise<ReturnInfo> {
  if (!node) {
    return { ok: false, message: 'No node provided' }
  }
  await put<StoredImageNode>('image_nodes', {
    id: node.id,
    type: node.type,
    layer: layerId,
    state: node.state,
    x: node.x,
    y: node.y,
  })
  return { ok: true, message: 'Node upserted' }
}

export async function updateImageNode(node: SavedNode): Promise<ReturnInfo> {
  const updated = await patch<StoredImageNode>('image_nodes', node.id, {
    state: node.state,
    comment: node.comment,
  })
  if (!updated) {
    return { ok: false, message: 'Error updating node' }
  }
  return { ok: true, message: 'Node updated' }
}

export async function saveImageNodePosition(
  nodeId: string,
  position: { x: number; y: number },
): Promise<ReturnInfo> {
  const updated = await patch<StoredImageNode>('image_nodes', nodeId, {
    x: position.x,
    y: position.y,
  })
  if (!updated) {
    return { ok: false, message: 'Error saving node position' }
  }
  return { ok: true, message: 'Node position saved' }
}

export async function deleteImageNode(nodeId: string): Promise<ReturnInfo> {
  await remove('image_nodes', nodeId)
  return { ok: true, message: 'Node deleted' }
}

export async function deleteImageConnection(
  connectionId: string,
): Promise<ReturnInfo> {
  await remove('image_connections', connectionId)
  return { ok: true, message: 'Connection deleted' }
}

export async function upsertImageConnection(
  connection: SavedConnection,
  layerId: string,
): Promise<ReturnInfo> {
  if (!connection) {
    return { ok: false, message: 'No connection provided' }
  }
  await put<StoredImageConnection>('image_connections', {
    ...connection,
    layer: layerId,
  })
  return { ok: true, message: 'Connection upserted' }
}

export async function getImageGraph(layerId: string): Promise<SavedGraph> {
  const nodes = await getAllBy<StoredImageNode>('image_nodes', 'layer', layerId)
  const connections = await getAllBy<StoredImageConnection>(
    'image_connections',
    'layer',
    layerId,
  )
  return { nodes: nodes || [], connections: connections || [] }
}
