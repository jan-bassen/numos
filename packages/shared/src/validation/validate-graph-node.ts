import type { MapGraph, MapGraphNode } from '@repo/shared/types/graph-types'
import type {
  ValidationContext,
  ValidationIssueData,
} from '@repo/shared/types/validation-types'
import { validateValue } from '@repo/shared/validation/validate-value'
import { nodeLogic } from '@repo/shared/engine/nodes/nodetypes'
import { validateConnection } from './validate-graph'
import type { Result } from '@repo/shared/types/result'
import { ValidationIssue } from '@repo/shared/errors/validation-error'

export function validateNode(
  graph: MapGraph,
  node: MapGraphNode,
  context: ValidationContext,
): ValidationIssueData[] {
  const issues: ValidationIssueData[] = []
  issues.push(...validateDataInputs(graph, node, context))
  issues.push(...validateControls(node, context))
  issues.push(...validateForwards(graph, node, context))
  const { error } = validateType(node, context)
  if (error) issues.push(error)
  return issues
}

// Check if every data input has a connection or valid control value
function validateDataInputs(
  graph: MapGraph,
  node: MapGraphNode,
  context: ValidationContext,
): ValidationIssueData[] {
  const issues: ValidationIssueData[] = []
  const { origin } = context
  for (const [inputKey, input] of Object.entries(node.inputs)) {
    if (!input.connection && !input.controlValue)
      issues.push(
        new ValidationIssue('Data input has no value', origin, {
          category: 'graph',
          level: 'error',
          type: 'value-missing',
          location: {
            node: node.id,
            component: { key: inputKey, type: 'input' },
          },
        }).serialize(),
      )
    if (input.connection) {
      const res = validateConnection(graph, node, 'input', inputKey, context)
      if (res.error) issues.push(res.error)
    }
    if (!input.connection && input.controlValue) {
      const { error } = validateValue(input.controlValue, false)
      if (error)
        issues.push(
          new ValidationIssue(
            `Input control value invalid: ${error.message}`,
            origin,
            {
              category: 'graph',
              level: 'error',
              type: 'value-invalid',
              location: {
                node: node.id,
                component: { key: inputKey, type: 'input' },
              },
            },
          ).serialize(),
        )
    }
  }
  return issues
}

// Check if every control has a valid value
function validateControls(node: MapGraphNode, context: ValidationContext) {
  const issues: ValidationIssueData[] = []
  const { origin } = context
  for (const [controlKey, control] of Object.entries(node.controls)) {
    if (!control.value)
      issues.push(
        new ValidationIssue('Control not found', origin, {
          category: 'graph',
          level: 'error',
          type: 'control-missing',
          location: {
            node: node.id,
            component: { key: controlKey, type: 'control' },
          },
        }).serialize(),
      )
    const { error } = validateValue(control, false)
    if (error)
      issues.push(
        new ValidationIssue(`Control value invalid: ${error.message}`, origin, {
          category: 'graph',
          level: 'error',
          type: 'value-invalid',
          location: {
            node: node.id,
            component: { key: controlKey, type: 'control' },
          },
        }).serialize(),
      )
  }
  return issues
}

// Check if every forwards connection leads to a valid node
function validateForwards(
  graph: MapGraph,
  node: MapGraphNode,
  context: ValidationContext,
) {
  const issues: ValidationIssueData[] = []
  for (const outputKey of Object.keys(node.forwards)) {
    const { error } = validateConnection(
      graph,
      node,
      'output',
      outputKey,
      context,
    )
    if (error) issues.push(error)
  }
  return issues
}

// Check if every node has a logic
function validateType(
  node: MapGraphNode,
  context: ValidationContext,
): Result<boolean, ValidationIssueData> {
  const logic = nodeLogic[node.type]
  const { origin } = context
  if (!logic) {
    return new ValidationIssue('Node type not found', origin, {
      category: 'graph',
      level: 'error',
      type: 'node-type-invalid',
      location: { node: node.id },
    }).toResult()
  }
  return { result: true }
}

//TODO: ADD
export function validateNodeAgainstExpectation(
  node: MapGraphNode,
  context: ValidationContext,
): void {
  const { origin } = context
  if (node.type === undefined)
    throw new ValidationIssue('Node type not defined', origin, {
      category: 'graph',
      level: 'critical',
      type: 'node-type-invalid',
    })
  //get expectation for node type and validate
}
