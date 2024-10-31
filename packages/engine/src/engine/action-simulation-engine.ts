import { isEqual } from 'lodash'
import type {
  ActionContext,
  ActionSimulationResult,
  EngineContext,
  LogEntry,
  SimulatedTokenStateResult,
  SimulationData,
} from '@repo/engine/types/engine-types'
import type { MapGraph } from '@repo/engine/types/graph-types'
import type {
  AnyExecNode,
  AnyExecutionNodeOutput,
  ExecutionInterface,
  MetadataChangeResult,
  StateChangeResult,
} from '@repo/engine/types/node-types'
import type {
  Value,
  ValueFormat,
  ValueType,
} from '@repo/engine/types/value-types'
import { SimulationEngine } from '@repo/engine/engine/base/simulation-engine'
import { NodeError } from '@repo/engine/errors/node-error'
import { GraphError } from '@repo/engine/errors/graph-error'

export class ActionSimulationEngine extends SimulationEngine {
  simulatedResult: SimulatedTokenStateResult
  constructor(
    graph: MapGraph,
    context: ActionContext,
    simulationData?: SimulationData,
  ) {
    super(graph, context, 'execution', simulationData)
    this.simulatedResult = {
      metadataChange: {},
      stateChange: {},
      logs: [],
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

  getParameter(key: string): Value<ValueType, 'single' | 'array', false> {
    const simulationData = this.getSimulationData()
    if (!simulationData) throw new Error('Simulation data not set')
    const value = simulationData.parameters[key]
    if (!value) throw new Error(`Parameter ${key} not found`)
    return this.validateAndResolveValue(value)
  }

  setTokenAttribute(
    key: string,
    value: Value<ValueType, ValueFormat, true>,
  ): StateChangeResult {
    const result = this.validateAndResolveValue(value)
    const previous = this.getTokenAttribute(key)
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

  setCollectionAttribute(
    key: string,
    value: Value<ValueType, ValueFormat, true>,
  ): StateChangeResult {
    const result = this.validateAndResolveValue(value)
    const previous = this.getCollectionAttribute(key)
    if (isEqual(previous, result)) return { previous, changed: false }
    this.simulatedResult.stateChange[key] = {
      old: previous,
      new: result,
    }
    this.simulatedResult.logs.push({
      message: `Set collection attribute ${key} to ${result.value}`,
    })
    return { previous, changed: true }
  }

  setMetadata(
    key: 'name' | 'description',
    value: string,
  ): MetadataChangeResult {
    const previous = this.getMetadata(key)
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
      ...this.getDataInterface(nodeId),
      revert: this.revertExecution,
      setTokenAttribute: this.setTokenAttribute,
      setCollectionAttribute: this.setCollectionAttribute,
      setMetadata: this.setMetadata,
    } as ExecutionInterface<AnyExecNode, true>
  }

  async runNodeLogic(nodeId: string): Promise<AnyExecutionNodeOutput> {
    const node = this.getNodeLogic(nodeId)
    if (!node) throw new Error(`Node ${nodeId} not found`)
    const executionInterface = this.getExecutionInterface(nodeId)
    if (!node.execution) throw new Error('Node has no execution logic')
    return node.execution(executionInterface, { ...this.getContext(), nodeId })
  }

  revertExecution() {
    this.resetSimulatedResult(true)
  }

  async execute(
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
        throw new Error('Loop detected')
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
          if (!nextNode) throw new Error('Next node not found')
          currentNode = nextNode
        } else {
          shouldContinue = false
        }
      } catch (err) {
        if (err instanceof NodeError) {
          throw new GraphError(err.message, {
            node: currentNode,
            ...err.location,
          })
        }
        throw err
      }
    }
    return { result: this.simulatedResult, error: undefined }
  }
}
