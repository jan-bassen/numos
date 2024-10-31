import type { NodeLogic } from '@repo/engine/types/node-types'
import type { DataSwitchNode } from '@repo/engine/nodes/data-switch/interface'

export const dataSwitchLogic: NodeLogic<DataSwitchNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const switchValue = await getInputValue('switch')
      return getInputValue(switchValue.value ? 'true' : 'false')
    },
  },
}
