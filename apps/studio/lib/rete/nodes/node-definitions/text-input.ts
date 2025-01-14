import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { TextInputNode } from '@repo/shared/engine/nodes/text-input/interface'

export const textInputDefinition: SpecificNodeDefinition<TextInputNode> = {
  type: 'text-input',
  category: 'data',
  title: 'Text',
  componentType: 'input',
  nodeInfo: {
    description: 'This node allows you to input a string of text.',
    link: '#number-input',
  },
  controls: [{ key: 'text', type: 'string' }],
  outputs: [{ key: 'output', type: 'string', label: 'Output' }],
}
