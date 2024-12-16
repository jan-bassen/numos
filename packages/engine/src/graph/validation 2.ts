import { validateValue } from '../datatypes/validation.js'
import { nodeLogic } from '../nodes/nodetypes.js'
import type { MapGraph, MapGraphNode } from '../types/graph-types.js'

// TODO: Even check if the node has the correct sockets and controls?
// TODO: Is there no unnecessary node (exec node with unconnected input, data node without connected output)

// Potential: Create checkers for each node type

export const validateGraph = (graph: MapGraph) => {
  try {
    validateRootNode(graph)
    validateAllNodes(graph)
    return { valid: true, error: undefined }
  } catch (error) {
    if (error instanceof Error) {
      return { valid: false, error: error.message }
    }
    return { valid: false, error: 'Unknown error' }
  }
}

// Check if the graph has a single connected root node
function validateRootNode(graph: MapGraph) {
  const rootNodes = Object.entries(graph).filter(([key, node]) => node.root)
  const rootNode = rootNodes[0]
  if (rootNodes.length === 0 || !rootNode) throw new Error('No root node found')
  if (rootNodes.length > 1) throw new Error('Multiple root nodes found')
  const [key, node] = rootNode
  if (node.type === 'image-root') {
    validateConnection(graph, node, 'input', 'image')
  }
  if (node.type === 'action-root') {
    validateConnection(graph, node, 'output', 'exec')
  }
}

function validateAllNodes(graph: MapGraph) {
  for (const [key, node] of Object.entries(graph)) {
    validateDataInputs(graph, node)
    validateControls(node)
    validateForwards(graph, node)
    validateType(node)
  }
}

function validateConnection(
  graph: MapGraph,
  node: MapGraphNode,
  side: 'input' | 'output',
  key: string,
) {
  if (side === 'input') {
    const input = node.inputs[key]
    if (!input) throw new Error(`Input ${key} not found`)
    if (!input.connection) throw new Error(`Input ${key} not connected`)
    if (!input.connection.node) throw new Error('Node not found')
    if (!graph[input.connection.node])
      throw new Error(`Connected node ${input.connection.node} not found`)
  }
  if (side === 'output') {
    const output = node.forwards[key]
    if (!output) throw new Error(`Output ${key} not found`)
    if (!output.node) throw new Error('Node not found')
    if (!graph[output.node])
      throw new Error(`Connected node ${output.node} not found`)
  }
  throw new Error('Invalid side')
}

// Check if every data input has a connection or valid control value
function validateDataInputs(graph: MapGraph, node: MapGraphNode) {
  for (const [inputKey, input] of Object.entries(node.inputs)) {
    if (!input.connection && !input.controlValue)
      throw new Error(`Data input ${inputKey} not found`)
    if (input.connection) {
      validateConnection(graph, node, 'input', inputKey)
    }
    if (!input.connection && input.controlValue) {
      const { error } = validateValue(input.controlValue, false)
      if (error)
        throw new Error(`Control value ${inputKey} invalid: ${error.message}`)
    }
  }
}

// Check if every control has a valid value
function validateControls(node: MapGraphNode) {
  for (const [controlKey, control] of Object.entries(node.controls)) {
    if (!control.value) throw new Error(`Control ${controlKey} not found`)
    const { error } = validateValue(control, false)
    if (error)
      throw new Error(`Control value ${controlKey} invalid: ${error.message}`)
  }
}

// Check if every forwards connection leads to a valid node
function validateForwards(graph: MapGraph, node: MapGraphNode) {
  for (const [outputKey, output] of Object.entries(node.forwards)) {
    if (!graph[output.node])
      throw new Error(`Connected node ${output.node} not found`)
  }
}

// Check if every node has a logic
function validateType(node: MapGraphNode) {
  const logic = nodeLogic[node.type]
  if (!logic) throw new Error(`Node type ${node.type} not found`)
}
