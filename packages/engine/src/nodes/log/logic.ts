import type { NodeLogic } from '@repo/engine/types/node-types'
import type { LogNode } from '@repo/engine/nodes/log/interface'
import { valueToText } from '@repo/shared/schemas/datatypes/utils'

export const logLogic: NodeLogic<LogNode> = {
  execution: async ({ getInputValue }) => {
    const value = await getInputValue('value')
    const message = valueToText(value)
    return {
      forward: 'exec',
      log: { message },
    }
  },
}
