import type { SpecificNodeDefinition } from '@/types/nodes.types'
import type { ReplaceNode } from '@repo/shared/engine/nodes/replace/interface'

export const replaceDefinition: SpecificNodeDefinition<ReplaceNode> = {
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
