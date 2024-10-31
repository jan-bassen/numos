import type { NodeLogic } from '@repo/engine/types/node-types'
import type { SwitchNode } from '@repo/engine/nodes/switch/interface'

export const switchLogic: NodeLogic<SwitchNode> = {
  execution: async ({ getInputValue }) => {
    const value = await getInputValue('switch')
    return {
      forward: value ? 'true' : 'false',
      log: { message: `Switch executed with value ${value.value}` },
    }
  },
}
