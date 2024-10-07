import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { DataSwitchNode } from './interface.ts'

export const dataSwitchLogic: NodeLogic<DataSwitchNode> = {
  data: {
    output: ({ getInputValue }) => {
      const switchValue = getInputValue('switch').value
      return getInputValue(switchValue ? 'true' : 'false')
    },
  },
}
