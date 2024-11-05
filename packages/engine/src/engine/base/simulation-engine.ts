import type { MapGraph } from '@repo/engine/types/graph-types'
import type {
  EngineContext,
  LogEntry,
  SimulationData,
} from '@repo/engine/types/engine-types'
import { EngineBase } from '@repo/engine/engine/base/engine-base'
import type { Value, ValueType } from '@repo/engine/types/value-types'
import { explicitlyValidateValue } from '@repo/engine/datatypes/validation'
import type { BasicMetadataKeys } from '@repo/engine/types/token-types'
import type {
  AnyDataNode,
  DataInterface,
  NodeData,
} from '@repo/engine/types/node-types'
import { GraphError } from '@repo/engine/errors/graph-error'
import { NodeError } from '@repo/engine/errors/node-error'

export class SimulationEngine extends EngineBase {
  constructor(
    graph: MapGraph,
    context: EngineContext,
    type: 'data' | 'execution',
    private simulationData?: SimulationData,
  ) {
    super(graph, context, 'simulation', type)
  }

  getSimulationData() {
    return this.simulationData
  }

  setSimulationData(simulationData: SimulationData) {
    this.simulationData = simulationData
  }

  getDataInterface: (nodeId: string) => DataInterface<AnyDataNode, true> = (
    nodeId,
  ) => ({
    getLayer: async (image: string) => {
      return this.getLayer(image, nodeId)
    },
    getParameter: (key: string) => {
      throw new GraphError('Parameters are not supported for images', {
        node: nodeId,
        input: { key, type: 'parameters' },
      })
    },
    getTokenAttribute: (key: string) => {
      return this.getTokenAttribute(key, nodeId)
    },
    getCollectionAttribute: (key: string) => {
      return this.getCollectionAttribute(key, nodeId)
    },
    getMetadata<Key extends BasicMetadataKeys>(
      key: Key,
    ): Value<Key extends 'id' ? 'number' : 'string', 'single', false> {
      return this.getMetadata<Key>(key)
    },
    getInputValue: async (key: string) => {
      return this.getInputValue(nodeId, key)
    },
    getControlValue: (key: string) => {
      return this.getControlValue(nodeId, key)
    },
  })

  async getInputValue(
    nodeId: string,
    key: string,
  ): Promise<Value<ValueType, 'single' | 'array', false>> {
    const connection = this.getConnection(nodeId, 'input', key)
    if (!connection) {
      return this.getInputControlValue(nodeId, key)
    }
    return this.getNodeOutput(connection.node, connection.key)
  }

  async getNodeOutput(
    nodeId: string,
    key: string,
  ): Promise<Value<ValueType, 'single' | 'array', false>> {
    const logic = this.getNodeLogic(nodeId)
    if (!logic) throw new GraphError('Node has no data logic', { node: nodeId })
    const dataLogic = logic.data as NodeData<AnyDataNode, true> | undefined
    if (!dataLogic)
      throw new GraphError('Node has no data logic', {
        node: nodeId,
        component: { key, type: 'output' },
      })
    if (typeof dataLogic === 'function') {
      try {
        const result = dataLogic(key, this.getDataInterface(nodeId), {
          ...this.getContext(),
          nodeId,
        })
        return result
      } catch (err) {
        if (err instanceof NodeError) throw err.convertToGraphError(nodeId)
        if (err instanceof Error) {
          throw new GraphError(err.message, { node: nodeId })
        }
        throw err
      }
    }
    const outputLogic = dataLogic[key]
    if (!outputLogic)
      throw new GraphError('Node has no output logic', {
        node: nodeId,
        component: { key, type: 'output' },
      })
    if (typeof outputLogic === 'function') {
      try {
        return outputLogic(this.getDataInterface(nodeId), {
          ...this.getContext(),
          nodeId,
        })
      } catch (err) {
        if (err instanceof NodeError) throw err.convertToGraphError(nodeId)
        throw err
      }
    }
    throw new GraphError('Node has no output logic', {
      node: nodeId,
      component: { key, type: 'output' },
    })
  }

  getTokenAttribute(
    key: string,
    node: string,
  ): Value<ValueType, 'array' | 'single', false> {
    if (!this.simulationData) throw new Error('Simulation data not set')
    const value = this.simulationData.attributes[key]
    if (!value)
      throw new GraphError(`Attribute ${key} not defined`, {
        node,
        input: { key, type: 'attributes' },
      })
    return this.validateAndResolveValue(value, node)
  }

  getCollectionAttribute(
    key: string,
    node: string,
  ): Value<ValueType, 'array' | 'single', false> {
    if (!this.simulationData) throw new Error('Simulation data not set')
    const value = this.simulationData.attributes[key]
    if (!value)
      throw new GraphError(`Attribute ${key} not defined`, {
        node,
        input: { key, type: 'attributes' },
      })
    return this.validateAndResolveValue(value, node)
  }

  getMetadata<Key extends BasicMetadataKeys>(
    key: Key,
    node: string,
  ): Value<Key extends 'id' ? 'number' : 'string', 'single', false> {
    if (!this.simulationData)
      throw new GraphError('Simulation data not set', {
        node,
        input: { key, type: 'metadata' },
      })
    const value = this.simulationData.basicMetadata[key]
    if (!value)
      throw new GraphError(`Metadata: ${key} not defined`, {
        node,
        input: { key, type: 'metadata' },
      })
    const type =
      key === 'id'
        ? ('number' as Key extends 'id' ? 'number' : 'string')
        : ('string' as Key extends 'id' ? 'number' : 'string')
    const { validated, error } = explicitlyValidateValue<
      Key extends 'id' ? 'number' : 'string',
      'single',
      false
    >(type, 'single', false, value)
    if (error)
      throw new GraphError('Error with parsing value', {
        node,
        input: { key, type: 'metadata' },
      })
    return validated
  }
}
