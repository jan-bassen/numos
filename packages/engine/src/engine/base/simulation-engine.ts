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
      return this.getLayer(image)
    },
    getParameter: (key: string) => {
      throw new Error('Parameters are not supported for images')
    },
    getTokenAttribute: (key: string) => {
      return this.getTokenAttribute(key)
    },
    getCollectionAttribute: (key: string) => {
      return this.getCollectionAttribute(key)
    },
    getMetadata<Key extends BasicMetadataKeys>(
      key: Key,
    ): Value<Key extends 'id' ? 'number' : 'string', 'single', false> {
      const value = this.getMetadata<Key>(key)
      return value
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
    if (!logic) throw new Error(`Node ${nodeId} has no data logic`)
    const dataLogic = logic.data as NodeData<AnyDataNode, true> | undefined
    if (!dataLogic) throw new Error(`Node ${nodeId} has no data logic`)
    if (typeof dataLogic === 'function') {
      const result = dataLogic(key, this.getDataInterface(nodeId), {
        ...this.getContext(),
        nodeId,
      })
      return result
    }
    const outputLogic = dataLogic[key]
    if (!outputLogic) throw new Error(`Node ${nodeId} has no output logic`)
    if (typeof outputLogic === 'function') {
      const result = outputLogic(this.getDataInterface(nodeId), {
        ...this.getContext(),
        nodeId,
      })
      return result
    }
    throw new Error(`Node ${nodeId} has no output logic`)
  }

  getTokenAttribute(key: string): Value<ValueType, 'array' | 'single', false> {
    if (!this.simulationData) throw new Error('Simulation data not set')
    const value = this.simulationData.attributes[key]
    if (!value) throw new Error(`Attribute ${key} not found`)
    return this.validateAndResolveValue(value)
  }

  getCollectionAttribute(
    key: string,
  ): Value<ValueType, 'array' | 'single', false> {
    if (!this.simulationData) throw new Error('Simulation data not set')
    const value = this.simulationData.attributes[key]
    if (!value) throw new Error(`Attribute ${key} not found`)
    return this.validateAndResolveValue(value)
  }

  getMetadata<Key extends BasicMetadataKeys>(
    key: Key,
  ): Value<Key extends 'id' ? 'number' : 'string', 'single', false> {
    if (!this.simulationData) throw new Error('Simulation data not set')
    const value = this.simulationData.basicMetadata[key]
    if (!value) throw new Error(`Metadata ${key} not found`)
    const type =
      key === 'id'
        ? ('number' as Key extends 'id' ? 'number' : 'string')
        : ('string' as Key extends 'id' ? 'number' : 'string')
    const { validated, error } = explicitlyValidateValue<
      Key extends 'id' ? 'number' : 'string',
      'single',
      false
    >(type, 'single', false, value)
    if (error) throw new Error('Error with parsing value')
    return validated
  }
}
