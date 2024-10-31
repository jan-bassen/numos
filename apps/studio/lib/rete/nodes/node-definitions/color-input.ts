import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ColorInputNode } from '@repo/engine/nodes/color-input/interface'

export const colorInputDefinition: SpecificNodeDefinition<ColorInputNode> = {
  type: 'color-input',
  category: 'data',
  title: 'Color',
  root: false,
  componentType: 'input',
  nodeInfo: {
    description: 'This node allows you to input a color.',
    link: '#color-input',
  },
  controls: [{ key: 'color', type: 'color' }],
  outputs: [{ key: 'output', type: 'color', label: 'Color' }],
}
