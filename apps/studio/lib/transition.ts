import type {
  OLDSavedControl,
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
            if (!i.control) return accumulator
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

const changedNodes: Record<
  string,
  {
    new: NodeType
    reset: boolean
    setInputs?: { [key: string]: OLDSavedDataInput }
    setControls?: { [key: string]: OLDSavedControl }
  }
> = {
  'attribute-data': {
    new: 'token-attribute',
    reset: false,
  },
  'change-attribute': {
    new: 'change-token-attribute',
    reset: false,
  },
  'list-append': {
    new: 'list-add',
    reset: false,
    setControls: {
      position: {
        key: 'position',
        type: 'enum',
        list: false,
        value: 'end',
      },
    },
  },
  'list-prepend': {
    new: 'list-add',
    reset: false,
    setControls: {
      position: {
        key: 'position',
        type: 'enum',
        list: false,
        value: 'start',
      },
    },
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
      if (changed.setInputs) {
        const newInputs = node.inputs
          ? {
              ...node.inputs,
              ...changed.setInputs,
            }
          : changed.setInputs
        return {
          ...node,
          type: changed.new,
          inputs: newInputs,
        }
      }
      if (changed.setControls) {
        const newControls = node.controls
          ? {
              ...node.controls,
              ...changed.setControls,
            }
          : changed.setControls
        return {
          ...node,
          type: changed.new,
          controls: newControls,
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
