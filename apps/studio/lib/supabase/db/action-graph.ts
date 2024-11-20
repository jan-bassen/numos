'use server'

import type { InsertActionNode, ReturnInfo } from '@/types/database.types'
import type {
  SavedConnection,
  SavedGraph,
  SavedNode,
} from '@repo/engine/types/graph-types'
import { createSupabaseServerComponentClient } from '../clients/server-client'
import { changeSavedNodeStructure, replaceRemovedNodes } from '@/lib/transition'

export async function insertActionNode(
  node: SavedNode,
  actionId: string,
): Promise<ReturnInfo> {
  if (!node) {
    return {
      ok: false,
      message: 'No version provided for new collection',
    }
  }

  const supabase = await createSupabaseServerComponentClient()

  const insertNode: InsertActionNode = {
    id: node.id,
    type: node.type,
    action: actionId,
    state: node.state,
    x: node.x,
    y: node.y,
  }

  const { error } = await supabase.from('action_nodes').insert(insertNode)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error upserting node',
    }
  }
  /* revalidatePath("/collections/[collection]/actions/[action]", "page"); */
  return {
    ok: true,
    message: 'Node upserted',
  }
}

export async function updateActionNode(node: SavedNode): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('action_nodes')
    .update({ state: node.state })
    .eq('id', node.id)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error updating node',
    }
  }
  /* revalidatePath("/collections/[collection]/actions/[action]", "page"); */
  return {
    ok: true,
    message: 'Node updated',
  }
}

export async function saveActionNodePosition(
  nodeId: string,
  position: { x: number; y: number },
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('action_nodes')
    .update({ x: position.x, y: position.y })
    .eq('id', nodeId)

  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }
  /*   revalidatePath("/collections/[collection]/actions/[action]", "page"); */
  return {
    ok: true,
    message: 'Node position saved',
  }
}

export async function deleteActionNode(nodeId: string): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('action_nodes')
    .delete()
    .eq('id', nodeId)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error deleting node',
    }
  }
  /* revalidatePath("/collections/[collection]/actions/[action]", "page"); */
  return {
    ok: true,
    message: 'Node deleted',
  }
}

export async function deleteActionConnection(
  connectionId: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('action_connections')
    .delete()
    .eq('id', connectionId)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error deleting connection',
    }
  }
  /* revalidatePath("/collections/[collection]/actions/[action]", "page"); */
  return {
    ok: true,
    message: 'Connection deleted',
  }
}

export async function upsertActionConnection(
  connection: SavedConnection,
  actionId: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  if (!connection) {
    return {
      ok: false,
      message: 'No action provided for new collection',
    }
  }
  const { error } = await supabase
    .from('action_connections')
    .upsert({ ...connection, action: actionId })
  if (error) {
    return {
      ok: false,
      message: error.message || 'Error upserting connection',
    }
  }
  /* revalidatePath("/collections/[collection]/actions/[action]", "page"); */
  return {
    ok: true,
    message: 'Connection upserted',
  }
}

export async function getActionGraph(actionId: string): Promise<SavedGraph> {
  const supabase = await createSupabaseServerComponentClient()

  const { data: nodes, error: nodesError } = await supabase
    .from('action_nodes')
    .select('*')
    .eq('action', actionId)
    .returns<SavedNode[]>()

  const replacedNodes = replaceRemovedNodes(nodes || [])
  const transformedNodes = changeSavedNodeStructure(replacedNodes)

  const { data: connections, error: connectionsError } = await supabase
    .from('action_connections')
    .select('*')
    .eq('action', actionId)

  if (nodesError || connectionsError) {
    throw new Error('Error fetching graph')
  }
  return {
    nodes: transformedNodes || [],
    connections: connections || [],
  }
}
