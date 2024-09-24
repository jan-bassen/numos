import {
  PiAutomationStroke,
  PiDatabaseStroke,
  PiFontAaStroke,
  PiGitFork02Stroke,
  PiMathStroke,
  PiSettings02Stroke,
} from '@/lib/icons'
import {
  type NodeDefinitions,
  type EditorConfig,
  type EditorContext,
  type NodeType,
  HybridNodeDefinitions,
  DataNodeDefinitions,
} from '@/types/nodes.types'
import _ from 'lodash'
import { type ActionNodeType, actionNodes } from '../definitions/action-nodes'
import { type DataNodeType, dataNodes } from '../definitions/data-nodes'
import { type MathNodeType, mathNodes } from '../definitions/math-nodes'
import { type TextNodeType, textNodes } from '../definitions/text-nodes'
import { type LogicNodeType, logicNodes } from '../definitions/logic-nodes'
import { type TimeNodeType, timeNodes } from '../definitions/time-nodes'
import {
  type UtilityNodeType,
  utilityNodes,
} from '../definitions/utility-nodes'
import { type ColorNodeType, colorNodes } from '../definitions/color-nodes'

import { baseConfig } from './base-config'
import { locationNodes } from '../definitions/location-nodes'
import { listNodes, type ListNodeType } from '../definitions/list-nodes'

export type ExtendedActionNodeType =
  | ActionNodeType
  | DataNodeType
  | MathNodeType
  | TextNodeType
  | LogicNodeType
  | TimeNodeType
  | UtilityNodeType
  | ColorNodeType
  | ListNodeType

export type ActionDataNodeType =
  | DataNodeType
  | MathNodeType
  | TextNodeType
  | LogicNodeType
  | TimeNodeType
  | UtilityNodeType
  | ColorNodeType
  | ListNodeType

export const actionEditorNodes: NodeDefinitions<ExtendedActionNodeType> = {
  ...actionNodes,
  ...dataNodes,
  ...mathNodes,
  ...textNodes,
  ...logicNodes,
  ...listNodes,
  ...timeNodes,
  ...locationNodes,
  ...utilityNodes,
  ...colorNodes,
}

export const actionConfig: EditorConfig = (context: EditorContext) => {
  const blocklist: NodeType[] = []
  const hasEnumAttribute = context.attributes.some(
    (attr) => attr.type === 'enum',
  )
  if (hasEnumAttribute) {
    blocklist.push('')
  }
  if (context.parameters?.length === 0) {
    blocklist.push('parameter-data')
  }
  return {
    root: { type: 'action-root', position: { x: -100, y: -50 } },
    nodes: actionEditorNodes,
    blocklist,
    groups: [
      {
        label: 'Action',
        key: 'action',
        Icon: PiAutomationStroke,
        subitems: ['parameter-data', 'switch', 'log', 'stop', 'cancel'],
      },
      ...baseConfig(context),
    ],
  }
}
