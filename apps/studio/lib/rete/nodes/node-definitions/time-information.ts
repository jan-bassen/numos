import type { NodeDefinition2 } from '@/types/nodes.types'
import type { TimeInformationNode } from '@repo/engine/src/nodes/time-information/interface'

export const timeInformationDefinition: NodeDefinition2<TimeInformationNode> = {
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
      defaultValue: 'seconds',
      options: [
        { value: 'second', label: 'Second of the minute' },
        { value: 'minute', label: 'Minute of the hour' },
        { value: 'hour', label: 'Hour of the day' },
        { value: 'day', label: 'Day of the week' },
        { value: 'day-of-month', label: 'Day of the month' },
        { value: 'week', label: 'Week of the year' },
        { value: 'month', label: 'Month of the year' },
        { value: 'year', label: 'Year' },
      ],
    },
  ],
  inputs: [{ key: 'time', type: 'datetime', label: 'Time' }],
  outputs: [{ key: 'output', type: 'number', label: 'Value' }],
}
