import type { NodeDependency } from '@/types/nodes.types'

// TODO: Find a way to make control keys to not be hardcoded "attribute"
export const attributeNodeDependency: NodeDependency = {
  element: 'attribute',
  nodes: [
    {
      nodeType: 'change-token-attribute',
      controls: ['attribute'], // Only attribute keys are supported for now
    },
    {
      nodeType: 'token-attribute',
      controls: ['attribute'], // Only attribute keys are supported for now
    },
    {
      nodeType: 'enum-input',
      controls: ['attribute'], // Only attribute keys are supported for now
    },
  ],
}
