import type { NodeDefinition2 } from '@/types/nodes.types'
import type { LocationInputNode } from '@repo/engine/src/nodes/location-input/interface'

export const locationInputDefinition: NodeDefinition2<LocationInputNode> = {
  type: 'location-input',
  category: 'data',
  title: 'Location',
  root: false,
  componentType: 'input',
  nodeInfo: {
    description: 'This node allows you to input a location.',
    link: '#location-input',
  },
  controls: [{ key: 'location', type: 'location' }],
  outputs: [{ key: 'output', type: 'location', label: 'Location' }],
}
