import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ActionRootNode } from './interface.js'

export const actionRootLogic: NodeLogic<ActionRootNode> = {
  execution: () => {
    return { forward: 'exec', log: { message: 'Action started' } }
  },
  data: (key, { getParameter }) => {
    const parameter = getParameter(key)
    return parameter
  },
}
