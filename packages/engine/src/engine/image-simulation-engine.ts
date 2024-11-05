import type {
  EngineContext,
  ImageSimulationResult,
  SimulationData,
} from '@repo/engine/types/engine-types'
import type { MapGraph } from '@repo/engine/types/graph-types'
import { SimulationEngine } from '@repo/engine/engine/base/simulation-engine'
import type { Value, ValueType } from '@repo/engine/types/value-types'
import { explicitlyValidateValue } from '@repo/engine/datatypes/validation'
import { GraphError } from '@repo/engine/errors/graph-error'
import { NodeError } from '../errors/node-error.ts'

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
    if (!logic)
      throw new GraphError('Root node has no data logic', { node: rootId })
    const rootLogic = logic.root
    if (!rootLogic)
      throw new GraphError('Root node has no root logic', { node: rootId })
    try {
      return rootLogic(this.getDataInterface(rootId), {
        ...this.getContext(),
        nodeId: rootId,
      })
    } catch (err) {
      if (err instanceof NodeError) throw err.convertToGraphError(rootId)
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
      if (error) {
        const [rootId, rootNode] = this.findRootNode()
        throw new GraphError(`Output invalid: ${error.message}`, {
          node: rootId,
        })
      }
      const result = {
        type: 'image',
        format: 'single',
        value: Buffer.from(validated.value).toString('base64'),
      } as Value<'image', 'single', false>
      return { result, error: undefined }
    } catch (err) {
      const error = this.serializeError(err)
      return { result: undefined, error }
    }
  }
}
