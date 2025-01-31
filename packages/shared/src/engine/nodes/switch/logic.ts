import type { NodeLogic } from '@repo/shared/types/node-types'
import type { SwitchNode } from '@repo/shared/engine/nodes/switch/interface'

export const switchLogic: NodeLogic<SwitchNode> = {
  execution: async ({ getInputValue }) => {
    const value = await getInputValue('switch')
    return {
      forward: value.value ? 'true' : 'false',
      log: { message: `Switch executed with value ${value.value}` },
    }
  },
}
