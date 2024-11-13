import type { MapGraph } from '@repo/engine/types/graph-types'
import type {
  ActionSimulationResult,
  EngineContext,
  ImageSimulationResult,
  LogEntry,
  SimulatedTokenStateResult,
  SimulationData,
} from '@repo/engine/types/engine-types'
import { EngineBase } from '@repo/engine/engine/base/engine-base'
import type {
  Value,
  ValueFormat,
  ValueType,
} from '@repo/engine/types/value-types'
import { explicitlyValidateValue } from '@repo/engine/datatypes/validation'
import type { BasicMetadataKeys } from '@repo/engine/types/token-types'
import type {
  AnyDataNode,
  AnyExecNode,
  AnyExecutionNodeOutput,
  DataInterface,
  ExecutionInterface,
  MetadataChangeResult,
  NodeData,
  StateChangeResult,
} from '@repo/engine/types/node-types'
import { GraphError } from '@repo/engine/errors/graph-error'
import { NodeError } from '@repo/engine/errors/node-error'
import { isEqual } from 'lodash'

export class SimulationEngine extends EngineBase {
  simulationData?: SimulationData
  simulatedResult: SimulatedTokenStateResult
  constructor(graph: MapGraph, context: EngineContext) {
    super(graph, context)
    this.simulatedResult = {
      metadataChange: {},
      stateChange: {},
      logs: [],
    }
  }

  getSimulationData() {
    return this.simulationData
  }

  setSimulationData(simulationData: SimulationData) {
    this.simulationData = simulationData
  }

  async getInputValue(
    nodeId: string,
    key: string,
    mode: 'data' | 'execution',
  ): Promise<Value<ValueType, 'single' | 'array', false>> {
    const connection = this.getConnection(nodeId, 'input', key)
    if (!connection) {
      return this.getInputControlValue(nodeId, key)
    }
    return this.getNodeOutput(connection.node, connection.key, mode)
  }

  async getNodeOutput(
    nodeId: string,
    key: string,
    mode: 'data' | 'execution',
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
        const result = dataLogic(key, this.getDataInterface(nodeId, mode), {
          ...this.getContext(),
          nodeId,
        })
        console.log('TRIED: ', result)
        return result
      } catch (err) {
        console.error(err)
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
        return await outputLogic(this.getDataInterface(nodeId, mode), {
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
      return rootLogic(this.getDataInterface(rootId, 'data'), {
        ...this.getContext(),
        nodeId: rootId,
      })
    } catch (err) {
      if (err instanceof NodeError) throw err.convertToGraphError(rootId)
      throw err
    }
  }

  resetSimulatedResult(keepLogs = false) {
    this.simulatedResult = {
      metadataChange: {},
      stateChange: {},
      logs: keepLogs ? this.simulatedResult.logs : [],
    }
  }

  addLog(entry: LogEntry) {
    if (!this.simulatedResult) throw new Error('Simulation data not set')
    this.simulatedResult.logs.push(entry)
  }

  async runNodeLogic(nodeId: string): Promise<AnyExecutionNodeOutput> {
    const node = this.getNodeLogic(nodeId)
    if (!node)
      throw new GraphError(`Node ${nodeId} not found`, { node: nodeId })
    const executionInterface = this.getExecutionInterface(nodeId)
    if (!node.execution)
      throw new GraphError('Node has no execution logic', {
        node: nodeId,
      })
    try {
      return node.execution(executionInterface, {
        ...this.getContext(),
        nodeId,
      })
    } catch (err) {
      if (err instanceof NodeError) throw err.convertToGraphError(nodeId)
      throw err
    }
  }

  revertExecution() {
    this.resetSimulatedResult(true)
  }

  // ---------- DATA INTERFACE ----------

  getTokenAttribute(
    key: string,
    node: string,
  ): Value<ValueType, 'array' | 'single', false> {
    if (!this.simulationData) throw new Error('Simulation data not set')
    const change = this.simulatedResult.stateChange[key]
    const value = change ? change.new : this.simulationData.attributes[key]
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
    const change = this.simulatedResult.stateChange[key]
    const value = change ? change.new : this.simulationData.attributes[key]
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
    const change = this.simulatedResult.metadataChange[key]
    const value = change ? change.new : this.simulationData.basicMetadata[key]
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

  getDataInterface: (
    nodeId: string,
    mode: 'data' | 'execution',
  ) => DataInterface<AnyDataNode, true> = (nodeId, mode) => {
    return {
      getLayer: async (image: string) => {
        return this.getLayer(image, nodeId)
      },
      getParameter: (key: string) => {
        if (mode === 'execution') return this.getParameter(key, nodeId)
        throw new GraphError('Parameters are not supported for images', {
          node: nodeId,
          input: { key, type: 'parameters' },
        })
      },
      getTokenAttribute: (key: string) => {
        return this.getTokenAttribute(key, nodeId)
      },
      getMetadata: <Key extends BasicMetadataKeys>(key: Key) => {
        return this.getMetadata<Key>(key, nodeId)
      },
      getInputValue: async (key: string) => {
        return this.getInputValue(nodeId, key, mode)
      },
      getControlValue: (key: string) => {
        return this.getControlValue(nodeId, key)
      },
    }
  }

  // ---------- EXECUTION INTERFACE ----------

  getParameter(
    key: string,
    node: string,
  ): Value<ValueType, 'single' | 'array', false> {
    const simulationData = this.getSimulationData()
    if (!simulationData) throw new Error('Simulation data not set')
    const value = simulationData.parameters[key]
    if (!value) throw new Error(`Parameter ${key} not found`)
    return this.validateAndResolveValue(value, node)
  }

  setTokenAttribute(
    key: string,
    value: Value<ValueType, ValueFormat, true>,
    node: string,
  ): StateChangeResult {
    const result = this.validateAndResolveValue(value, node)
    const previous = this.getTokenAttribute(key, node)
    if (isEqual(previous, result)) return { previous, changed: false }
    this.simulatedResult.stateChange[key] = {
      old: previous,
      new: result,
    }
    this.simulatedResult.logs.push({
      message: `Set token attribute ${key} to ${result.value}`,
    })
    return { previous, changed: true }
  }

  setMetadata(
    key: 'name' | 'description',
    value: string,
    node: string,
  ): MetadataChangeResult {
    const previous = this.getMetadata(key, node)
    if (previous.value === value) return { previous, changed: false }
    this.simulatedResult.metadataChange[key] = {
      old: previous,
      new: {
        type: 'string',
        format: 'single',
        value,
      },
    }
    this.simulatedResult.logs.push({
      message: `Set basic metadata ${key} to ${value}`,
    })
    return { previous, changed: true }
  }

  getExecutionInterface(nodeId: string): ExecutionInterface<AnyExecNode, true> {
    return {
      ...this.getDataInterface(nodeId, 'execution'),
      revert: this.revertExecution.bind(this),
      setTokenAttribute: this.setTokenAttribute.bind(this),
      setMetadata: this.setMetadata.bind(this),
    } as ExecutionInterface<AnyExecNode, true>
  }

  // ---------- EXECUTION ----------

  async executeAction(
    simulationData: SimulationData,
  ): Promise<ActionSimulationResult> {
    this.setSimulationData(simulationData)
    this.resetSimulatedResult()
    const [rootId, rootNode] = this.findRootNode()

    const alreadyRunNodes: Record<string, boolean> = {}
    let shouldContinue = true
    let currentNode: string = rootId
    while (shouldContinue) {
      if (currentNode && alreadyRunNodes[currentNode]) {
        const error = new GraphError('Loop detected', {
          node: currentNode,
        }).serialize()
        return { result: undefined, error }
      }
      try {
        const { forward, log } = await this.runNodeLogic(currentNode)
        this.addLog(log)
        if (forward) {
          alreadyRunNodes[currentNode] = true
          const nextNode = this.getConnection(
            currentNode,
            'output',
            forward,
          )?.node
          if (!nextNode) {
            this.addLog({
              message: 'No further connection found',
            })
            this.addLog({
              message: 'Action ended',
            })
            shouldContinue = false
            break
          }
          currentNode = nextNode
        } else {
          shouldContinue = false
        }
        //TODO: Fix Error-Location (wrong Node on get input from simulation data) !
      } catch (err) {
        if (err instanceof NodeError) {
          return {
            result: undefined,
            error: err.convertToGraphError(currentNode).serialize(),
          }
        }
        if (err instanceof GraphError) {
          return { result: undefined, error: err.serialize() }
        }
        if (err instanceof Error) {
          return {
            result: undefined,
            error: { type: 'unknown', message: err.message },
          }
        }
        throw err
      }
    }
    return { result: this.simulatedResult, error: undefined }
  }

  async createImage(
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
