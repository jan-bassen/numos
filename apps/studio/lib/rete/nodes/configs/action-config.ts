import { PiAutomationStroke } from '@repo/ui/icons/pika'
import type {
  NodeDefinitions,
  EditorConfig,
  EditorContext,
} from '@/types/nodes.types'
import _ from 'lodash'
import { baseConfig } from './base-config'
import type { NodeType } from '@repo/engine/src/types/node-types'
import { nodeDefinitions } from './definitions'

export const actionConfig: EditorConfig = (context: EditorContext) => {
  const blocklist: NodeType[] = []
  if (context.parameters?.length === 0) {
    blocklist.push('parameter')
  }
  return {
    type: 'execution',
    root: { type: 'action-root', position: { x: -100, y: -50 } },
    nodes: nodeDefinitions,
    blocklist,
    groups: [
      {
        label: 'Action',
        key: 'action',
        Icon: PiAutomationStroke,
        subitems: ['parameter', 'switch', 'log', 'stop', 'cancel'],
      },
      ...baseConfig(context),
    ],
  }
}
