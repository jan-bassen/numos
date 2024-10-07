import type { NodeDefinition2 } from '@/types/nodes.types'
import type { TextCombineNode } from '@repo/engine/src/nodes/text-combine/interface'

export const textCombineDefinition: NodeDefinition2<TextCombineNode> = {
  type: 'text-combine',
  category: 'data',
  title: 'Combine',
  nodeInfo: {
    description:
      'This node allows you to concenate two texts into a single one. The seperator is a space by default.',
    link: '#text-combine',
    example: "'Hello' + 'World' = 'Hello World'",
  },
  inputs: [
    { key: 'part1', type: 'string', label: 'Part 1' },
    { key: 'part2', type: 'string', label: 'Part 2' },
  ],
  controls: [
    {
      key: 'separator',
      type: 'string',
      label: 'Separator',
      placeholder: 'Seperator',
      defaultValue: ' ',
    },
  ],
  outputs: [{ key: 'output', type: 'string', label: 'Output' }],
}
