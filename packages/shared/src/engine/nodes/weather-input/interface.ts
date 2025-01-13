import type { NodeInterface } from '@repo/shared/types/node-types'

export interface WeatherInputNode extends NodeInterface<'data'> {
  type: 'weather-input'
  category: 'data'
  controls: {
    weather: {
      type: 'weather'
      list: false
    }
  }
  outputs: {
    output: {
      type: 'weather'
      list: false
    }
  }
}
