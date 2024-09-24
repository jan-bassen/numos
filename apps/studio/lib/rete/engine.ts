'use server'

import type {
  Attribute,
  SimulatedStateChange,
  SimulatedTokenStateResult,
  ValueDataType,
  OptionalTokenState,
  SimulatedMetadataChange,
  NotatedDataTypeValue,
  Collection,
  Version,
} from '@/types/database.types'
import type {
  SimulationContext,
  ControlSimulationResult,
  NodeMap,
  DataMap,
  SavedControl,
  SavedControlMap,
  SavedDataInput,
  SavedExecOutput,
  SavedMapNode,
} from '@/types/nodes.types'
import {
  GraphError,
  type GraphErrorData,
  type UnkownErrorData,
} from '../errors'
import { logic } from './nodes/configs/logic'
import {
  isValidValueType,
  validateValueType,
} from '@/components/datatypes/schemas'
import {
  Parameter,
  type ParameterState,
} from '@/components/elements/actions/action-schema'
import { resolveListValue } from '@/components/datatypes/utils'

export type SimulationExecutionData = {
  graph: NodeMap
  context: SimulationContext
  state: OptionalTokenState
  initialState: OptionalTokenState
}

export async function getInputs(nodeId: string, data: SimulationExecutionData) {
  const inputs: DataMap = {}
  const node = data.graph[nodeId]
  if (!node) {
    throw new GraphError('Node not found', nodeId)
  }

  const promises = Object.entries(node.inputs).map(async ([key, input]) => {
    if (key === 'exec') {
      return
    }
    const dataInput = input as SavedDataInput
    if (dataInput.connection?.node) {
      const output = await simulateOutput(
        dataInput.connection.node,
        dataInput.connection.output,
        data,
      )
      if (output.value === undefined || output.value === null) {
        throw new GraphError('Output value missing', nodeId)
      }
      const { result, error } = validateValueType(
        output.type,
        output.list,
        output.value,
        { optional: true, asObjectArray: false },
      )
      if (error) {
        throw new GraphError('Error with parsing value', nodeId, {
          type: 'input',
          id: dataInput.id,
        })
      }
      return { key, result }
    }
    if (
      dataInput.control?.value !== undefined &&
      dataInput.control?.value !== null
    ) {
      const controlValue = dataInput.control.list
        ? dataInput.control.value.map((v) => v.value)
        : dataInput.control.value
      const { result, error } = validateValueType(
        dataInput.type,
        dataInput.list,
        controlValue,
        { optional: true, asObjectArray: false },
      )
      if (error) {
        throw new GraphError('Error with parsing value', nodeId, {
          type: 'input',
          id: dataInput.id,
        })
      }
      return {
        key,
        result,
      }
    }
    throw new GraphError('Input value missing', nodeId, {
      type: 'input',
      id: dataInput.id,
    })
  })

  const results = await Promise.all(promises)
  const isDefined = <T>(value: T | undefined): value is T => value !== undefined
  const definedResults = results.filter(isDefined) as {
    key: string
    result: NotatedDataTypeValue
  }[]

  for (const { key, result } of definedResults) {
    inputs[key] = result
  }

  return inputs
}

export async function resolveControls(
  controls: SavedControlMap<true>,
  nodeId: string,
): Promise<SavedControlMap<false>> {
  const values = Object.keys(controls).reduce<SavedControlMap<false>>(
    (accumulator, key) => {
      const control = controls[key]
      if (!control) throw new Error('Control not found')
      const { result, error } = validateValueType(
        control.type as ValueDataType,
        control.list,
        control.value,
        { optional: true, asObjectArray: true },
      )
      if (error) {
        throw new GraphError('Error with parsing value', nodeId, {
          type: 'control',
          id: control.key,
        })
      }
      if (result.list) {
        accumulator[key] = {
          ...control,
          value: resolveListValue<true>(result.value),
        } as SavedControl<false>
        return accumulator
      }
      accumulator[key] = control as SavedControl<false>
      return accumulator
    },
    {},
  )

  return values
}

export async function simulateOutput(
  nodeId: string,
  outputKey: string,
  data: SimulationExecutionData,
  root?: boolean,
): Promise<NotatedDataTypeValue> {
  const node = data.graph[nodeId]
  if (!node) {
    throw new GraphError('Node not found', nodeId)
  }
  const output = node.outputs[outputKey]
  if (!output && !root) {
    throw new GraphError(`Output ${outputKey} not found`, nodeId)
  }
  const inputs = await getInputs(nodeId, data)
  const controls = await resolveControls(node.controls, nodeId)

  const nodeLogic = logic[node.type]
  if (!nodeLogic) throw new GraphError('Node logic not found', nodeId)
  if (!logic) throw new GraphError('Logic not found', nodeId)
  const outputLogic = nodeLogic.simulate.outputs
  if (!outputLogic) {
    throw new GraphError('Output logic not found', nodeId)
  }
  if (typeof outputLogic === 'function') {
    return await outputLogic(outputKey, {
      ...data,
      inputs,
      controls,
      node,
    })
  }
  const outputLogicFunction = outputLogic[outputKey]
  if (!outputLogicFunction)
    throw new GraphError('Output logic function not found', nodeId)
  return await outputLogicFunction({
    ...data,
    inputs,
    controls,
    node,
  })
}

export async function simulateForward(
  nodeId: string,
  data: SimulationExecutionData,
): Promise<ControlSimulationResult> {
  const node = data.graph[nodeId]
  if (!node) {
    throw new GraphError('Node not found', nodeId)
  }
  const inputs = await getInputs(nodeId, data)
  const controls = await resolveControls(node.controls, nodeId)
  const nodeLogic = logic[node.type]
  if (!nodeLogic) throw new GraphError('Node logic not found', nodeId)
  const execLogic = nodeLogic.simulate.execution
  if (typeof execLogic === 'function') {
    return await execLogic({
      ...data,
      inputs,
      controls,
      node,
    })
  }
  return {
    state: data.state,
    log: 'Logic not defined for node',
  }
}

export async function getConnectedNode(node: SavedMapNode, key: string) {
  const output = node.outputs[key] as SavedExecOutput
  if (!output) {
    throw new GraphError(`Output ${key} not found`, node.id)
  }
  if (!output.connection?.node) {
    return
  }
  return output.connection.node
}

export async function simulateImageGraph(
  graph: NodeMap,
  root: string,
  state: OptionalTokenState,
  attributes: Attribute[],
  version: Version,
): Promise<{
  image?: string
  error?: GraphErrorData | UnkownErrorData
}> {
  const rootNode = graph[root]
  if (!rootNode) {
    throw new Error(`Node with id ${root} not found`)
  }
  try {
    const result = await simulateOutput(
      root,
      'output',
      {
        graph,
        state,
        initialState: state,
        context: { attributes, version },
      },
      true,
    )
    return { image: result.value as string }
  } catch (error) {
    if (error instanceof GraphError) {
      return { error: error.serialize() }
    }
    if (error instanceof Error) {
      return { error: { type: 'unknown', message: error.message } }
    }
    return { error: { type: 'unknown', message: 'Unknown error' } }
  }
}

export async function simulateActionGraph(
  graph: NodeMap,
  root: string,
  state: OptionalTokenState,
  version: Version,
  attributes: Attribute[],
  parameters?: ParameterState,
): Promise<{
  result?: SimulatedTokenStateResult
  error?: GraphErrorData | UnkownErrorData
}> {
  const rootNode = graph[root]
  if (!rootNode) {
    throw new Error(`Node with id ${root} not found`)
  }
  try {
    const alreadyRunNodes: Record<string, boolean> = {}
    let shouldContinue = true
    let currentNode: string | undefined = root
    let newState: OptionalTokenState = state
    const logs: string[] = []
    while (shouldContinue) {
      if (currentNode && alreadyRunNodes[currentNode]) {
        throw new GraphError('Loop detected', currentNode)
      }
      if (!currentNode) {
        const metadataChange: SimulatedMetadataChange = {}
        if (
          newState.metadata.name !== state.metadata.name &&
          newState.metadata.name
        ) {
          metadataChange.name = {
            old: {
              type: 'string',
              list: false,
              value: state.metadata.name || 'Undefined',
            },
            new: { type: 'string', list: false, value: newState.metadata.name },
            label: 'Name',
          }
        }
        if (
          newState.metadata.description !== state.metadata.description &&
          newState.metadata.description
        ) {
          metadataChange.description = {
            old: {
              type: 'string',
              list: false,
              value: state.metadata.description || 'Undefined',
            },
            new: {
              type: 'string',
              list: false,
              value: newState.metadata.description,
            },
            label: 'Description',
          }
        }
        const simulatedResult = {
          metadataChange,
          stateChange: Object.entries(
            state.attributes,
          ).reduce<SimulatedStateChange>((acc, [key, value]) => {
            const newValue = newState.attributes[key]
            if (!newValue) throw new Error('New attribute not found')
            acc[key] = {
              old: value,
              new: newValue,
              label:
                attributes.find((attr) => attr.slug === key)?.name || undefined,
            }
            return acc
          }, {}),
          logs: logs || [],
        }
        shouldContinue = false
        simulatedResult.logs.push('Action ended')
        return { result: simulatedResult }
      }
      const result = await simulateForward(currentNode, {
        graph,
        state: newState,
        initialState: state,
        context: { attributes, parameters, version },
      })
      newState = result.state
      if (result.log) {
        if (typeof result.log === 'string' && result.log !== '') {
          logs.push(result.log)
        }
        if (Array.isArray(result.log)) {
          for (const log of result.log) {
            if (typeof log === 'string' && log !== '') {
              logs.push(log)
            }
          }
        }
      }
      if (result.forward) {
        alreadyRunNodes[currentNode] = true
        const node = graph[currentNode]
        if (!node) throw new GraphError('Node not found', currentNode)
        currentNode = await getConnectedNode(node, result.forward)
      } else {
        currentNode = undefined
      }
    }
  } catch (error) {
    console.log(error)
    if (error instanceof GraphError) {
      return { error: error.serialize() }
    }
    if (error instanceof Error) {
      return { error: { type: 'unknown', message: error.message } }
    }
    return { error: { type: 'unknown', message: 'Unknown error' } }
  }
  return { error: { type: 'unknown', message: 'Exection ended unexpectedly' } }
}

/* export async function resolveControlValue(
  control: SavedControl,
  nodeId: string,
): Promise<NotatedDataTypeValue<true, false>> {
  const { result, error } = validateValueType(
    control.type as ValueDataType,
    false,
    control.value,
    { optional: true, asObjectArray: true },
  )
  if (error) {
    throw new GraphError('Error with parsing value', nodeId, {
      type: 'control',
      id: control.key,
    })
  }
  if (result.list) {
    return {
      ...result,
      value: resolveListValue<true>(result.value),
    } as NotatedDataTypeValue<true, false>
  }
  return result
} */
