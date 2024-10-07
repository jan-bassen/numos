import type { NodeDefinition2 } from '@/types/nodes.types'
import type { ReplaceNode } from '@repo/engine/src/nodes/replace/interface'

export const replaceDefinition: NodeDefinition2<ReplaceNode> = {
  type: 'replace',
  category: 'data',
  title: 'Replace',
  nodeInfo: {
    description: 'This node allows you to replace a string with another one.',
    link: '#replace',
    example:
      "(Search: 'World', Replace: 'Frens'): 'Hello World' = 'Hello Frens'",
  },
  inputs: [
    { key: 'text', type: 'string', label: 'Text' },
    { key: 'search', type: 'string', label: 'Search' },
    { key: 'replace', type: 'string', label: 'Replace' },
  ],
  outputs: [{ key: 'output', type: 'string', label: 'Output' }],
}
