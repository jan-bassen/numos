import { actionNodesLogic } from '../logic/action-nodes'
import { dataNodesLogic } from '../logic/data-nodes'
import { mathNodesLogic } from '../logic/math-nodes'
import { textNodesLogic } from '../logic/text-nodes'
import { logicNodesLogic } from '../logic/logic-nodes'
import { timeNodesLogic } from '../logic/time-nodes'
import { utilityNodesLogic } from '../logic/utility-nodes'
import { colorNodesLogic } from '../logic/color-nodes'
import type { NodeLogicDefinitions, NodeType } from '@/types/nodes.types'
import { imageNodesLogic } from '../logic/image-nodes'
import { locationNodesLogic } from '../logic/location-nodes'
import { listNodesLogic } from '../logic/list-nodes'

export const logic: NodeLogicDefinitions<NodeType> = {
  ...actionNodesLogic,
  ...imageNodesLogic,
  ...imageNodesLogic,
  ...dataNodesLogic,
  ...mathNodesLogic,
  ...textNodesLogic,
  ...logicNodesLogic,
  ...listNodesLogic,
  ...timeNodesLogic,
  ...locationNodesLogic,
  ...utilityNodesLogic,
  ...colorNodesLogic,
}
