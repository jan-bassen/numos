import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { WeatherInputNode } from '@repo/engine/nodes/weather-input/interface'

export const weatherInputDefinition: SpecificNodeDefinition<WeatherInputNode> =
  {
    type: 'weather-input',
    category: 'data',
    title: 'Weather',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a weather condition.',
      link: '#weather-input',
    },
    controls: [{ key: 'weather', type: 'weather' }],
    outputs: [{ key: 'output', type: 'weather', label: 'Weather' }],
  }
