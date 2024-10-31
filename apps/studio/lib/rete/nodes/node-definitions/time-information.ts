import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { TimeInformationNode } from '@repo/engine/nodes/time-information/interface'

export const timeInformationDefinition: SpecificNodeDefinition<TimeInformationNode> =
  {
    type: 'time-information',
    category: 'data',
    title: 'Time Information',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node outputs information about a time.',
      example: '(Unit: Hours): 12:00:00 = 12',
      link: '#',
    },
    controls: [
      {
        key: 'unit',
        type: 'enum',
        label: 'Unit',
        settings: {
          options: [
            { value: 'seconds', label: 'Seconds' },
            { value: 'minutes', label: 'Minutes' },
            { value: 'hours', label: 'Hours' },
            { value: 'days', label: 'Days' },
            { value: 'weeks', label: 'Weeks' },
            { value: 'months', label: 'Months' },
            { value: 'years', label: 'Years' },
          ],
          default: 'seconds',
        },
      },
    ],
    inputs: [{ key: 'time', type: 'datetime', label: 'Time' }],
    outputs: [{ key: 'output', type: 'number', label: 'Value' }],
  }
