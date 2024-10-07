import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { SwitchNode } from './interface.ts'

export const switchLogic: NodeLogic<SwitchNode> = {
  execution: async ({ getInputValue }) => {
    const value = getInputValue('switch')
    return {
      forward: value ? 'true' : 'false',
      log: { message: `Switch executed with value ${value.value}` },
    }
  },
}
