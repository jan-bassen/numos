import type { Action } from '@/types/database.types'
import { getMapGraph } from './graph-to-map'
import type { SavedGraph } from '@repo/shared/types/graph-types'
import { validateGraph } from '@repo/shared/validation/validate-graph'
import type { ValidationIssueData } from '@repo/shared/types/validation-types'

export function validateAction(action: Action, graph: SavedGraph) {
  const issues: ValidationIssueData[] = []
  // Validate trigger

  //validate graph
  const mapGraph = getMapGraph(graph)
  const { error } = validateGraph(mapGraph, {
    origin: { type: 'action', key: action.slug },
  })
  if (error) {
    issues.push(...error)
  }
  return issues
}
