import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { LogNode } from './interface.ts'
import { valueToText } from '@repo/engine/datatypes/utils.ts'

export const logLogic: NodeLogic<LogNode> = {
  execution: async ({ getInputValue }) => {
    const value = getInputValue('value')
    const message = valueToText(value)
    return {
      forward: 'exec',
      log: { message },
    }
  },
}
