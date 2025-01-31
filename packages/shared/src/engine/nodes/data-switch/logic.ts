import type { NodeLogic } from '@repo/shared/types/node-types'
import type { DataSwitchNode } from '@repo/shared/engine/nodes/data-switch/interface'

export const dataSwitchLogic: NodeLogic<DataSwitchNode> = {
  data: {
    output: async ({ getInputValue }) => {
      const switchValue = await getInputValue('switch')
      return getInputValue(switchValue.value ? 'true' : 'false')
    },
  },
}
