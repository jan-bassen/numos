import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ActionRootNode } from '@repo/engine/nodes/action-root/interface'

export const actionRootLogic: NodeLogic<ActionRootNode> = {
  execution: () => {
    return { forward: 'exec', log: { message: 'Action started' } }
  },
  data: (key, { getParameter }) => {
    const parameter = getParameter(key)
    return parameter
  },
}
