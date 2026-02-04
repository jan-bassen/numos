import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { DatetimeInputNode } from '@repo/shared/engine/nodes/datetime-input/interface'

export const datetimeInputDefinition: SpecificNodeDefinition<DatetimeInputNode> =
  {
    type: 'datetime-input',
    category: 'data',
    title: 'Datetime',
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a datetime.',
      link: '#datetime-input',
    },
    controls: [{ key: 'datetime', type: 'datetime' }],
    outputs: [{ key: 'output', type: 'datetime', label: 'Datetime' }],
  }
