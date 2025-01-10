import type { SavedNode } from '@repo/engine/types/graph-types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import type { SavedGraph } from '@repo/engine/types/graph-types'
import { replaceRemovedNodes, changeSavedNodeStructure } from '@/lib/transition'

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
