import type { NodeDefinition2 } from '@/types/nodes.types'
import type { TimeDifferenceNode } from '@repo/engine/src/nodes/time-difference/interface'

export const timeDifferenceDefinition: NodeDefinition2<TimeDifferenceNode> = {
  type: 'time-difference',
  category: 'data',
  title: 'Time Difference',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description: 'This node outputs the difference between two times.',
    example: '(Unit: Hours): 12:00:00 - 10:00:00 = 2',
    link: '#',
  },
  controls: [
    {
      key: 'unit',
      type: 'enum',
      label: 'Unit',
      defaultValue: 'seconds',
      options: [
        { value: 'seconds', label: 'Seconds' },
        { value: 'minutes', label: 'Minutes' },
        { value: 'hours', label: 'Hours' },
        { value: 'days', label: 'Days' },
        { value: 'weeks', label: 'Weeks' },
        { value: 'months', label: 'Months' },
        { value: 'years', label: 'Years' },
      ],
    },
  ],
  inputs: [
    { key: 'time1', type: 'datetime', label: 'Time 1' },
    { key: 'time2', type: 'datetime', label: 'Time 2' },
  ],
  outputs: [{ key: 'output', type: 'number', label: 'Difference' }],
}
