import type { NodeDefinition2 } from '@/types/nodes.types'
import type { DirectionInputNode } from '@repo/engine/src/nodes/direction-input/interface'

export const directionInputDefinition: NodeDefinition2<DirectionInputNode> = {
  type: 'direction-input',
  category: 'data',
  title: 'Direction',
  root: false,
  componentType: 'input',
  nodeInfo: {
    description: 'This node allows you to input a simple direction.',
    link: '#direction-input',
  },
  controls: [{ key: 'direction', type: 'direction' }],
  outputs: [{ key: 'output', type: 'direction', label: 'Direction' }],
}
