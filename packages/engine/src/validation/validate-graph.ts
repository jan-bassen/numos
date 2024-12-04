import { ValidationIssue } from '@repo/engine/errors/validation-error'
import type { MapGraph, MapGraphNode } from '@repo/engine/types/graph-types'
import type { Result } from '@repo/shared/types/result'
import type {
  ValidationContext,
  ValidationIssueData,
} from '@repo/engine/types/validation-types'
import { validateNode } from '@repo/engine/validation/validate-graph-node'

// TODO: Check if all attributes will be set at mint!!!
// TODO: Is there no unnecessary node (exec node with unconnected input, data node without connected output)
// TODO: Potential: Create checkers for each node type

export function validateGraph(
  graph: MapGraph,
  context: ValidationContext,
): Result<boolean, ValidationIssueData[]> {
  const issues: ValidationIssueData[] = []
  try {
    const { error } = validateRootNode(graph, context)
    if (error) issues.push(error)
    const nodeIssues = validateAllNodes(graph, context)
    issues.push(...nodeIssues)
    if (issues.length > 0) return { error: issues }
    return { result: true }
  } catch (error) {
    if (error instanceof ValidationIssue) {
      return error.toArrayResult()
    }
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Unknown error'

    const { origin } = context
    return new ValidationIssue(message, origin, {
      category: 'graph',
      level: 'critical',
      type: 'unknown',
    }).toArrayResult()
  }
}

function validateAllNodes(
  graph: MapGraph,
  context: ValidationContext,
): ValidationIssueData[] {
  const issues: ValidationIssueData[] = []
  for (const [key, node] of Object.entries(graph)) {
    issues.push(...validateNode(graph, node, context))
  }
  return issues
}

// Check if the graph has a single connected root node
function validateRootNode(
  graph: MapGraph,
  context: ValidationContext,
): Result<boolean, ValidationIssueData> {
  const rootNodes = Object.entries(graph).filter(([key, node]) => node.root)
  const rootNode = rootNodes[0]
  const { origin } = context
  if (rootNodes.length === 0 || !rootNode)
    return new ValidationIssue('No root node found', origin, {
      category: 'graph',
      level: 'critical',
      type: 'root-node-missing',
    }).toResult()
  if (rootNodes.length > 1)
    return new ValidationIssue('Multiple root nodes found', origin, {
      category: 'graph',
      level: 'critical',
      type: 'root-node-multiple',
    }).toResult()
  const [key, node] = rootNode
  if (node.type === 'image-root') {
    const res = validateConnection(graph, node, 'input', 'image', context)
    if (res.error) return res
  }
  if (node.type === 'action-root') {
    const res = validateConnection(graph, node, 'output', 'exec', context)
    if (res.error) return res
  }
  return { result: true }
}

export function validateConnection(
  graph: MapGraph,
  node: MapGraphNode,
  side: 'input' | 'output',
  key: string,
  context: ValidationContext,
): Result<boolean, ValidationIssueData> {
  const connection =
    side === 'input' ? node.inputs[key]?.connection : node.forwards[key]
  const { origin } = context
  if (!connection || !connection.node)
    return new ValidationIssue('Connection not found', origin, {
      category: 'graph',
      level: 'error',
      type: 'connection-missing',
      location: { node: node.id },
    }).toResult()
  if (!graph[connection.node])
    return new ValidationIssue('Connected node not found', origin, {
      category: 'graph',
      level: 'error',
      type: 'node-missing',
      location: { node: connection.node },
    }).toResult()
  return { result: true }
}
