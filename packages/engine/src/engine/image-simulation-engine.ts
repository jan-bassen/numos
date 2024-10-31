import type {
  EngineContext,
  GraphErrorData,
  ImageSimulationResult,
  SimulationData,
  UnknownErrorData,
} from '@repo/engine/types/engine-types'
import type { MapGraph } from '@repo/engine/types/graph-types'
import { SimulationEngine } from '@repo/engine/engine/base/simulation-engine'
import type { Value, ValueType } from '@repo/engine/types/value-types'
import { explicitlyValidateValue } from '@repo/engine/datatypes/validation'
import { GraphError } from '@repo/engine/errors/graph-error'
import { NodeError } from '@repo/engine/errors/node-error'

//TODO: Make errors to specific errors

export class ImageSimulationEngine extends SimulationEngine {
  constructor(
    graph: MapGraph,
    context: EngineContext,
    simulationData?: SimulationData,
  ) {
    super(graph, context, 'data', simulationData)
  }

  async getRootNodeOutput(): Promise<
    Value<ValueType, 'single' | 'array', false>
  > {
    const [rootId, rootNode] = this.findRootNode()
    const logic = this.getNodeLogic(rootId)
    if (!logic) throw new Error(`Node ${rootId} has no data logic`)
    const rootLogic = logic.root
    if (!rootLogic) throw new Error(`Node ${rootId} has no root logic`)
    try {
      const result = rootLogic(this.getDataInterface(rootId), {
        ...this.getContext(),
        nodeId: rootId,
      })
      return result
    } catch (err) {
      if (err instanceof NodeError) {
        throw new GraphError(err.message, {
          node: rootId,
          ...err.location,
        })
      }
      throw err
    }
  }

  async execute(
    simulationData: SimulationData,
  ): Promise<ImageSimulationResult> {
    this.setSimulationData(simulationData)
    try {
      const res = await this.getRootNodeOutput()
      const { validated, error } = explicitlyValidateValue(
        'buffer',
        'single',
        false,
        res,
      )
      if (error) throw new Error(error.message)
      return { result: validated, error: undefined }
    } catch (err) {
      const error = this.serializeError(err)
      return { result: undefined, error }
    }
  }
}
