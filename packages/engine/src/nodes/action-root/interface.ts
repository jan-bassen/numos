import type {
  NodeComponentType,
  NodeInterface,
} from '@repo/engine/types/node-types.ts'

export interface ActionRootNode extends NodeInterface<'hybrid', true> {
  type: 'action-root'
  category: 'hybrid'
  root: true
  outputs: {
    [key in string]: NodeComponentType
  }
  forwards: ['exec']
}
