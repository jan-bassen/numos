import type {
  OLDSavedDataInput,
  SavedNode,
  SavedNodeState,
} from '@repo/engine/types/graph-types'
import type { NodeType } from '@repo/engine/types/node-types'
import type {
  NodeValueMap,
  Value,
  ValueType,
} from '@repo/engine/types/value-types'

export function changeSavedNodeStructure(oldNodes: SavedNode[]): SavedNode[] {
  return oldNodes.map((node) => {
    if (node.state) {
      return node
    }
    const i = node.inputs
    let inputs: NodeValueMap = {}
    if (i) {
      inputs = Object.entries(i).reduce<NodeValueMap>(
        (accumulator, [key, input]) => {
          if (input.type !== 'exec') {
            const i = input as OLDSavedDataInput
            if (!i.control?.value) return accumulator
            accumulator[key] = {
              type: i.type,
              format: i.list ? 'objectarray' : 'single',
              value: i.control?.value,
            } as Value<ValueType, 'single' | 'objectarray', true>
          }
          return accumulator
        },
        {} as NodeValueMap,
      )
    }

    const c = node.controls
    let controls: NodeValueMap = {}
    if (c) {
      controls = Object.entries(c).reduce<NodeValueMap>(
        (accumulator, [key, control]) => {
          if (!control.value) return accumulator
          accumulator[key] = {
            type: control.type,
            format: control.list ? 'objectarray' : 'single',
            value: control.value,
          } as Value<ValueType, 'single' | 'objectarray', true>
          return accumulator
        },
        {} as NodeValueMap,
      )
    }

    const state: SavedNodeState = {
      inputs,
      controls,
    }
    return {
      ...node,
      state,
      inputs: undefined,
      controls: undefined,
      outputs: undefined,
    }
  })
}

const changedNodes: Record<string, { new: NodeType; reset: boolean }> = {
  'attribute-data': {
    new: 'token-attribute',
    reset: true,
  },
  'change-attribute': {
    new: 'change-token-attribute',
    reset: true,
  },
  'list-append': {
    new: 'list-add',
    reset: true,
  },
  'list-prepend': {
    new: 'list-add',
    reset: true,
  },
  'meta-data': {
    new: 'metadata',
    reset: false,
  },
}
export function replaceRemovedNodes(nodes: SavedNode[]): SavedNode[] {
  return nodes.map((node) => {
    const changed = changedNodes[node.type]
    if (changed) {
      if (changed.reset) {
        return {
          ...node,
          type: changed.new,
          inputs: undefined,
          controls: undefined,
          outputs: undefined,
        }
      }
      return {
        ...node,
        type: changed.new,
      }
    }
    return node
  })
}
