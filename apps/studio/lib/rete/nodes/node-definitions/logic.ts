import type { NodeDefinition2 } from '@/types/nodes.types'
import type { LogicNode } from '@repo/engine/src/nodes/logic/interface'

export const logicDefinition: NodeDefinition2<LogicNode> = {
  type: 'logic',
  category: 'data',
  title: 'Logic',
  nodeInfo: {
    description: 'This node allows you to combine multiple inputs.',
    example: '(Mode: And): yes && no = no',
    link: '#logic',
  },
  inputs: ({ getControlValue }) => {
    const mode = getControlValue('mode').value
    if (mode === 'not')
      return [{ key: 'boolean1', type: 'boolean', label: 'Boolean' }]
    return [
      { key: 'boolean1', type: 'boolean', label: 'Boolean 1' },
      { key: 'boolean2', type: 'boolean', label: 'Boolean 2' },
    ]
  },
  controls: [
    {
      key: 'mode',
      type: 'enum',
      label: 'Select Mode',
      defaultValue: 'and',
      onChange: (node) => {
        node.updateInputs()
      },
      options: [
        { value: 'and', label: 'And' },
        { value: 'or', label: 'Or' },
        { value: 'not', label: 'Not' },
        { value: 'xor', label: 'Xor' },
        { value: 'nand', label: 'Nand' },
      ],
    },
  ],
  outputs: [{ key: 'output', type: 'boolean', label: 'Output' }],
}
