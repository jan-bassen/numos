import type { NodeLogic } from '@repo/shared/types/node-types'
import type { WeatherInputNode } from '@repo/shared/engine/nodes/weather-input/interface'

export const weatherInputLogic: NodeLogic<WeatherInputNode> = {
  data: {
    output: ({ getControlValue }) => {
      return getControlValue('weather')
    },
  },
}
