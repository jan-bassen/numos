import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { LocationDistanceNode } from '@repo/engine/nodes/location-distance/interface'

export const locationDistanceDefinition: SpecificNodeDefinition<LocationDistanceNode> =
  {
    type: 'location-distance',
    category: 'data',
    title: 'Location Distance',
    nodeInfo: {
      description:
        'This node outputs the distance between two locations in the given unit.',
      link: '#',
    },
    controls: [
      {
        key: 'unit',
        type: 'enum',
        label: 'Unit',
        settings: {
          default: 'km',
          options: [
            { value: 'km', label: 'Kilometers' },
            { value: 'meter', label: 'Meters' },
            { value: 'mile', label: 'Miles' },
            { value: 'yard', label: 'Yards' },
            { value: 'nautical mile', label: 'Nautical Miles' },
          ],
        },
      },
    ],
    inputs: [
      { key: 'loc1', type: 'location', label: 'Location 1' },
      { key: 'loc2', type: 'location', label: 'Location 2' },
    ],
    outputs: [{ key: 'output', type: 'number', label: 'Distance' }],
  }
