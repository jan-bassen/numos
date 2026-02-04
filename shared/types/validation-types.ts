import type { NodeCategory, NodeInterface } from '@repo/shared/types/node-types'
import type { GraphErrorLocation } from '@repo/shared/errors/graph-error'

export type NodeExpectation<I extends NodeInterface<NodeCategory>> = {
  type: I['type']
  root: I['root']
  rootOutput: I['rootOutput']
  inputs: I['inputs']
  forwards: I['forwards']
  controls: I['controls']
}

export type ValidationIssueInfo = GraphIssueInfo | BugIssueInfo

export type ValidationIssueType =
  | GraphValidationIssueType
  | BugValidationIssueType

export type ValidationContext = {
  origin: ValidationIssueOrigin
}

export type ValidationIssueOrigin =
  | {
      type: 'action' | 'attribute'
      key: string
    }
  | {
      type: 'collection' | 'image' | 'layer'
    }

interface ValidationIssueBase {
  category: 'graph' | 'bug'
  level: 'warning' | 'error' | 'critical'
  type: ValidationIssueType
}

export type GraphValidationIssueType =
  | 'unknown'
  | 'node-missing'
  | 'root-node-missing'
  | 'root-node-multiple'
  | 'input-missing'
  | 'output-missing'
  | 'control-missing'
  | 'connection-missing'
  | 'node-type-invalid'
  | 'value-invalid'
  | 'value-missing'

interface GraphIssueInfo extends ValidationIssueBase {
  category: 'graph'
  type: GraphValidationIssueType
  location?: GraphErrorLocation
}

type BugValidationIssueType = 'multiple-root-nodes' | 'missing-root-node'

interface BugIssueInfo extends ValidationIssueBase {
  category: 'bug'
  type: BugValidationIssueType
  origin: ValidationIssueOrigin
}

export type ValidationIssueData = {
  message: string
  origin: ValidationIssueOrigin
  info: ValidationIssueInfo
}
