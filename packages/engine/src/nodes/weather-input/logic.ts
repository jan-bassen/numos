import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { WeatherInputNode } from './interface.ts'

export const weatherInputLogic: NodeLogic<WeatherInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('weather')
    },
  },
}
