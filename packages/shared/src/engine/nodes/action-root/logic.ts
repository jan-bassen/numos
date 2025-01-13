import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ActionRootNode } from '@repo/shared/engine/nodes/action-root/interface'

export const actionRootLogic: NodeLogic<ActionRootNode> = {
  execution: () => {
    return { forward: 'exec', log: { message: 'Action started' } }
  },
  data: (key, { getParameter }) => {
    const parameter = getParameter(key)
    return parameter
  },
}
