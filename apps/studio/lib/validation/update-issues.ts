'use server'

import { getActionGraph } from '../supabase/db/action-graph'
import { getAllActions } from '../supabase/db/actions'
import { validateAction } from './validate-action'

export async function updateIssues(version: string) {
  // actions into own file and function later
  const actions = await getAllActions(version)
  const action = actions[0]
  if (!action) return
  const graph = await getActionGraph(action.id)
  const res = validateAction(action, graph)

  // attributes into own file and function later
  // collection + version into own file and function later
}
