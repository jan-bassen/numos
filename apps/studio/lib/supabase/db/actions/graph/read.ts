import type { SavedNode } from '@repo/shared/types/graph-types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import type { SavedGraph } from '@repo/shared/types/graph-types'
import 'server-only'

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
