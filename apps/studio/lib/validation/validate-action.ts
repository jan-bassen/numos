import type { Action } from '@/types/database.types'
import { getMapGraph } from './graph-to-map'
import type { SavedGraph } from '@repo/engine/types/graph-types'
import { validateGraph } from '@repo/engine/validation/validate-graph'

export function validateAction(action: Action, graph: SavedGraph) {
  // Validate trigger

  //validate graph
  const mapGraph = getMapGraph(graph)
  const { result, error } = validateGraph(mapGraph, {
    origin: { type: 'action', key: action.slug },
  })
  if (error) {
    console.log(error)
    return false
  }
  return true
}
