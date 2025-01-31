'use server'

import type { InsertImageNode, ReturnInfo } from '@/types/database.types'
import type {
  SavedConnection,
  SavedGraph,
  SavedNode,
} from '@repo/shared/types/graph-types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'

export async function insertImageNode(
  node: SavedNode,
  layerId: string,
): Promise<ReturnInfo> {
  if (!node) {
    return {
      ok: false,
      message: 'No version provided for new collection',
    }
  }

  const supabase = await createSupabaseServerComponentClient()

  const insertNode: InsertImageNode = {
    id: node.id,
    type: node.type,
    layer: layerId,
    state: node.state,
    x: node.x,
    y: node.y,
  }
  const { error } = await supabase.from('image_nodes').insert(insertNode)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error upserting node',
    }
  }
  /* revalidatePath("/collections/[collection]/image", "page"); */
  return {
    ok: true,
    message: 'Node upserted',
  }
}

export async function updateImageNode(node: SavedNode): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('image_nodes')
    .update({
      state: node.state,
      comment: node.comment,
    })
    .eq('id', node.id)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error updating node',
    }
  }
  /* revalidatePath("/collections/[collection]/image", "page"); */
  return {
    ok: true,
    message: 'Node updated',
  }
}

export async function saveImageNodePosition(
  nodeId: string,
  position: { x: number; y: number },
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('image_nodes')
    .update({ x: position.x, y: position.y })
    .eq('id', nodeId)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error saving node position',
    }
  }
  /* revalidatePath("/collections/[collection]/image", "page"); */
  return {
    ok: true,
    message: 'Node position saved',
  }
}

export async function deleteImageNode(nodeId: string): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase.from('image_nodes').delete().eq('id', nodeId)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error deleting node',
    }
  }
  /* revalidatePath("/collections/[collection]/image", "page"); */
  return {
    ok: true,
    message: 'Node deleted',
  }
}

export async function deleteImageConnection(
  connectionId: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('image_connections')
    .delete()
    .eq('id', connectionId)

  if (error) {
    return {
      ok: false,
      message: error.message || 'Error deleting connection',
    }
  }
  /* revalidatePath("/collections/[collection]/image", "page"); */
  return {
    ok: true,
    message: 'Connection deleted',
  }
}

export async function upsertImageConnection(
  connection: SavedConnection,
  layerId: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  if (!connection) {
    return {
      ok: false,
      message: 'No version provided for new collection',
    }
  }
  const { error } = await supabase
    .from('image_connections')
    .upsert({ ...connection, layer: layerId })
  if (error) {
    return {
      ok: false,
      message: error.message || 'Error upserting connection',
    }
  }
  /* revalidatePath("/collections/[collection]/image", "page"); */
  return {
    ok: true,
    message: 'Connection upserted',
  }
}

export async function getImageGraph(layerId: string): Promise<SavedGraph> {
  const supabase = await createSupabaseServerComponentClient()

  const { data: nodes, error: nodesError } = await supabase
    .from('image_nodes')
    .select('*')
    .eq('layer', layerId)
    .returns<SavedNode[]>()

  const { data: connections, error: connectionsError } = await supabase
    .from('image_connections')
    .select('*')
    .eq('layer', layerId)

  if (nodesError || connectionsError) {
    throw new Error('Error fetching graph')
  }

  return {
    nodes: nodes || [],
    connections: connections || [],
  }
}
