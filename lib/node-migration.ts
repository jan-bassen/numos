/* 'use server'

import type { ImageNode } from '@/types/database.types'
import type {
  OLDSavedDataInput,
  SavedNode,
  SavedNodeState,
} from '@repo/shared/types/graph-types'
import type { NodeValueMap, Value, ValueType } from '@repo/shared/types/values'
import { createSupabaseServiceClient } from './supabase/clients/service-client'

export async function migrateImageNodes() {
  const supabase = await createSupabaseServiceClient()
  const { data, error } = await supabase
    .from('action_nodes')
    .select('*')
    .returns<ImageNode[]>()

  if (error || !data) return

  const newNodes = data.filter((node) => {
    if (node === null) return false
    return Object.entries(node?.controls ?? {}).some(([key, control]) => {
      if (node.state?.controls?.[key]) return false
      if (control?.value) return true
      return false
    })
  })

  const newNodes2 = await changeSavedNodeStructure(newNodes)

  for (const node of newNodes2) {
    console.log(node)
         const { data, error } = await supabase
      .from('image_nodes')
      .update({ state: node.state })
      .eq('id', node.id)
      .select()
      .returns<ImageNode[]>()

    console.log(error, data) 
  }
}

export async function changeSavedNodeStructure(
  nodes: ImageNode[],
): ImageNode[] {
  return nodes.map((node) => {
    const { state, inputs, controls, ...rest } = node

    let newInputs: NodeValueMap = {}
    if (inputs) {
      newInputs = Object.entries(inputs).reduce<NodeValueMap>(
        (accumulator, [key, input]) => {
          if (state?.inputs?.[key]) return accumulator
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

    let newControls: NodeValueMap = {}
    if (controls) {
      newControls = Object.entries(controls).reduce<NodeValueMap>(
        (accumulator, [key, control]) => {
          if (state?.controls[key]) return accumulator
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

    const newState: SavedNodeState = {
      inputs: {
        ...newInputs,
        ...state?.inputs,
      },
      controls: {
        ...newControls,
        ...state?.controls,
      },
    }

    return {
      ...rest,
      state: newState,
      inputs: undefined,
      controls: undefined,
      outputs: undefined,
    }
  })
}
 */
