'use server'

import {
  ActionConnection,
  type InsertActionNode,
  type ReturnInfo,
} from '@/types/database.types'
import type {
  SavedConnection,
  SavedGraph,
  SavedNode,
} from '@/types/nodes.types'
import { createSupabaseServerComponentClient } from '../server-client'
import { revalidatePath } from 'next/cache'

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
    controls: node.controls,
    id: node.id,
    inputs: node.inputs,
    outputs: node.outputs,
    type: node.type,
    action: actionId,
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
  /* revalidatePath("/studio/[collection]/actions/[action]", "page"); */
  return {
    ok: true,
    message: 'Node upserted',
  }
}

export async function updateActionNode(node: SavedNode): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('action_nodes')
    .update({
      controls: node.controls,
      inputs: node.inputs,
      outputs: node.outputs,
    })
    .eq('id', node.id)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error updating node',
    }
  }
  /* revalidatePath("/studio/[collection]/actions/[action]", "page"); */
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
  /* revalidatePath("/studio/[collection]/actions/[action]", "page"); */
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
  /* revalidatePath("/studio/[collection]/actions/[action]", "page"); */
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
  /* revalidatePath("/studio/[collection]/actions/[action]", "page"); */
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

  const { data: connections, error: connectionsError } = await supabase
    .from('action_connections')
    .select('*')
    .eq('action', actionId)

  if (nodesError || connectionsError) {
    throw new Error('Error fetching graph')
  }
  return {
    nodes: nodes || [],
    connections: connections || [],
  }
}
