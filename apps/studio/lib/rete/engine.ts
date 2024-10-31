'use server'

import type {
  ActionContext,
  ActionSimulationResult,
  EngineContext,
  ImageSimulationResult,
  SimulationData,
} from '@repo/engine/types/engine-types'
import type { MapGraph } from '@repo/engine/types/graph-types'
import { ImageSimulationEngine } from '@repo/engine/engine/image-simulation-engine'
import { ActionSimulationEngine } from '@repo/engine/engine/action-simulation-engine'

export async function simulateImageGraph(
  graph: MapGraph,
  data: SimulationData,
  context: EngineContext,
): Promise<ImageSimulationResult> {
  const engine = new ImageSimulationEngine(graph, context)
  return engine.execute(data)
}

export async function simulateActionGraph(
  graph: MapGraph,
  data: SimulationData,
  context: ActionContext,
): Promise<ActionSimulationResult> {
  const engine = new ActionSimulationEngine(graph, context)
  return engine.execute(data)
}
