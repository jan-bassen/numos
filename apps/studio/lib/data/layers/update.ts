import type { Layer, UpdateLayer } from '@/types/database.types'
import { updateLayerSchema } from '@/lib/schemas/layers/layer-schema'
import { createSafeUpdate } from '@/lib/data/create-safe-update'
import { z } from 'zod'
import { bulkPut, get, patch } from '@/lib/data/store'

export async function updateLayerBase(id: string, values: UpdateLayer) {
  const updated = await patch<Layer>('layers', id, values)
  if (!updated) {
    return { ok: false, message: 'Layer not found' }
  }
  return { ok: true, message: 'Layer updated' }
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

  const updated: Layer[] = []
  for (const change of valid) {
    const layer = await get<Layer>('layers', change.id)
    if (layer) {
      updated.push({ ...layer, index: change.index })
    }
  }
  await bulkPut('layers', updated)
  return { ok: true, message: 'Layer order updated' }
}
