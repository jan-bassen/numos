import type {
  NodeExpectation,
  /*  ValidationIssueOrigin, */
} from '@repo/engine/types/validation-types'
import type { ActionRootNode } from '@repo/engine/nodes/action-root/interface'
/* import type { MapGraphNode } from '@repo/engine/types/graph-types' */

export const expectation: NodeExpectation<ActionRootNode> = {
  type: 'action-root',
  root: true,
  rootOutput: undefined,
  inputs: undefined,
  forwards: ['exec'],
  controls: undefined,
}

export function validateActionRootNode(
  /*   node: MapGraphNode,
  context: ValidationIssueOrigin, */
) {
  //Check param outputs
}
