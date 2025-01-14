'use server'

import type { SavedNode } from '@repo/shared/types/graph-types'
import { createSupabaseServiceClient } from '@/lib/supabase/clients/service-client'
import { changeSavedNodeStructure } from '@/lib/transition'

export async function migrate() {
  const supabase = await createSupabaseServiceClient()
  const { data, error } = await supabase
    .from('image_nodes')
    .select('*')
    .returns<SavedNode[]>()

  if (error || !data) return

  const newNodes = changeSavedNodeStructure(data)

  /* for (const node of newNodes) {
    const { data, error } = await supabase
      .from('image_nodes')
      .update({
        // @ts-ignore
        state: {
          inputs: node.state.inputs,
          controls: node.state.controls,
        },
      })
      .eq('id', node.id)

    if (error) {
      break
    }
    setTimeout(() => {
      console.log(`Migrated node ${node.id}`)
    }, 20)
  } */
}

//NEXT UP: ATTRIBUTES AND PARAMS BY ID!
