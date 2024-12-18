import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ParameterNode } from '@repo/engine/nodes/parameter/interface'

export const parameterDefinition: SpecificNodeDefinition<ParameterNode> = {
  type: 'parameter',
  category: 'data',
  title: 'Parameter',
  nodeInfo: {
    description:
      "This node outputs the value of a parameter, which is the same value as you'll get from the Trigger node.",
    link: '#parameter',
  },
  controls: ({ getParameters }) => {
    const parameters = getParameters()
    const options = parameters?.map((parameter) => {
      return {
        value: parameter.key,
        label: parameter.key,
      }
    })
    return [
      {
        key: 'parameter',
        type: 'enum',
        placeholder: 'Select Parameter',
        settings: { options },
        onChange: (node) => {
          node.updateOutputs()
        },
      },
    ]
  },
  outputs: ({ getParameter }) => {
    const parameter = getParameter('parameter')
    if (!parameter) return []
    return [
      {
        key: 'parameter',
        list: parameter.value.list,
        type: parameter.value.type,
        label: parameter.key,
      },
    ]
  },
}
