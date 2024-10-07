import type { NodeDefinition2 } from '@/types/nodes.types'
import type { TextInputNode } from '@repo/engine/src/nodes/text-input/interface'

export const textInputDefinition: NodeDefinition2<TextInputNode> = {
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
