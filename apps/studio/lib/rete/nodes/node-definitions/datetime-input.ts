import type { NodeDefinition2 } from '@/types/nodes.types'
import type { DatetimeInputNode } from '@repo/engine/src/nodes/datetime-input/interface'

export const datetimeInputDefinition: NodeDefinition2<DatetimeInputNode> = {
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
