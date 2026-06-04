import type {
  SavedConnection,
  SavedGraph,
  SavedNode,
} from '@repo/shared/types/graph-types'
import { getAllBy } from '@/lib/data/store'

export async function getActionGraph(actionId: string): Promise<SavedGraph> {
  const nodes = await getAllBy<SavedNode & { action: string }>(
    'action_nodes',
    'action',
    actionId,
  )
  const connections = await getAllBy<SavedConnection & { action: string }>(
    'action_connections',
    'action',
    actionId,
  )
  return {
    nodes: nodes || [],
    connections: connections || [],
  }
}
