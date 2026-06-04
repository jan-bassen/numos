import type { ReturnInfo } from '@/types/database.types'
import type {
  SavedConnection,
  SavedGraph,
  SavedNode,
} from '@repo/shared/types/graph-types'
import { getAllBy, patch, put, remove } from './store'

type StoredActionNode = SavedNode & { action: string }
type StoredActionConnection = SavedConnection & { action: string }

export async function insertActionNode(
  node: SavedNode,
  actionId: string,
): Promise<ReturnInfo> {
  if (!node) {
    return { ok: false, message: 'No node provided' }
  }
  await put<StoredActionNode>('action_nodes', {
    id: node.id,
    type: node.type,
    action: actionId,
    state: node.state,
    x: node.x,
    y: node.y,
  })
  return { ok: true, message: 'Node upserted' }
}

export async function updateActionNode(node: SavedNode): Promise<ReturnInfo> {
  const updated = await patch<StoredActionNode>('action_nodes', node.id, {
    state: node.state,
  })
  if (!updated) {
    return { ok: false, message: 'Error updating node' }
  }
  return { ok: true, message: 'Node updated' }
}

export async function saveActionNodePosition(
  nodeId: string,
  position: { x: number; y: number },
): Promise<ReturnInfo> {
  const updated = await patch<StoredActionNode>('action_nodes', nodeId, {
    x: position.x,
    y: position.y,
  })
  if (!updated) {
    return { ok: false, message: 'Error saving node position' }
  }
  return { ok: true, message: 'Node position saved' }
}

export async function deleteActionNode(nodeId: string): Promise<ReturnInfo> {
  await remove('action_nodes', nodeId)
  return { ok: true, message: 'Node deleted' }
}

export async function deleteActionConnection(
  connectionId: string,
): Promise<ReturnInfo> {
  await remove('action_connections', connectionId)
  return { ok: true, message: 'Connection deleted' }
}

export async function upsertActionConnection(
  connection: SavedConnection,
  actionId: string,
): Promise<ReturnInfo> {
  if (!connection) {
    return { ok: false, message: 'No connection provided' }
  }
  await put<StoredActionConnection>('action_connections', {
    ...connection,
    action: actionId,
  })
  return { ok: true, message: 'Connection upserted' }
}

export async function getActionGraph(actionId: string): Promise<SavedGraph> {
  const nodes = await getAllBy<StoredActionNode>(
    'action_nodes',
    'action',
    actionId,
  )
  const connections = await getAllBy<StoredActionConnection>(
    'action_connections',
    'action',
    actionId,
  )
  return { nodes: nodes || [], connections: connections || [] }
}
