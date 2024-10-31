import type { NodeLogic } from '@repo/engine/types/node-types'
import type { WeatherInputNode } from '@repo/engine/nodes/weather-input/interface'

export const weatherInputLogic: NodeLogic<WeatherInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('weather')
    },
  },
}
