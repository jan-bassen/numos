'use server'

import type { MapGraph } from '@repo/shared/types/graph-types'
import { validateGraph } from '@repo/shared/validation/validate-graph'

export async function validateMapGraph(graph: MapGraph) {
  const { result: success, error } = validateGraph(graph, {
    origin: { type: 'collection' },
  })
  if (!success) {
    console.log(error)
  }
}
