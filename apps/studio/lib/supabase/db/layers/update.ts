'use server'

import 'server-only'

import type { UpdateLayer } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { updateLayerSchema } from '@/lib/schemas/layers/layer-schema'
import { createSafeUpdate } from '@/lib/supabase/db/create-safe-update'
import { z } from 'zod'

export async function updateLayerBase(id: string, values: UpdateLayer) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('image_layers')
    .update(values)
    .eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }
  return { ok: true, message: 'Action updated' }
}

export const updateLayer = createSafeUpdate<UpdateLayer>(
  updateLayerBase,
  updateLayerSchema,
)

export type LayerOrderChange = z.infer<typeof layerOrderSchema>
const layerOrderSchema = z.array(
  z.object({
    id: z.string(),
    index: z.number(),
  }),
)
export async function updateLayerOrder(layers: LayerOrderChange) {
  let valid: LayerOrderChange
  try {
    valid = layerOrderSchema.parse(layers)
  } catch (error) {
    return { ok: false, message: 'Invalid layer order' }
  }

  const supabase = await createSupabaseServerComponentClient()
  const promises = valid.map((layer) => {
    return supabase
      .from('image_layers')
      .update({ index: layer.index })
      .eq('id', layer.id)
  })
  const results = await Promise.all(promises)
  const error = results.find((res) => res.error !== null)
  if (error) {
    return { ok: false, message: error.error.message }
  }
  return { ok: true, message: 'Action updated' }
}
