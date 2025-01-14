'use server'

import type {
  ActionContext,
  ActionSimulationResult,
  EngineContext,
  ImageSimulationResult,
  SimulationData,
} from '@repo/shared/types/engine-types'
import type { MapGraph } from '@repo/shared/types/graph-types'
import { SimulationEngine } from '@repo/shared/engine/simulation-engine'

export async function simulateImageGraph(
  graph: MapGraph,
  data: SimulationData,
  context: EngineContext,
): Promise<ImageSimulationResult> {
  const engine = new SimulationEngine(graph, context)
  return engine.createImage(data)
}

export async function simulateActionGraph(
  graph: MapGraph,
  data: SimulationData,
  context: ActionContext,
): Promise<ActionSimulationResult> {
  const engine = new SimulationEngine(graph, context)
  return engine.executeAction(data)
}
