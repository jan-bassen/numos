import { FetchError } from '@/lib/errors'
import type { Layer } from '@/types/database.types'
import { getAllBy, remove, removeBy } from '@/lib/data/store'
import { redirect as nextRedirect } from 'next/navigation'

export async function deleteLayer(
  id: string,
  options?: { redirect?: string; revalidate?: string },
) {
  const { redirect } = options ?? {}
  if (!id) {
    throw new FetchError('No layer defined')
  }

  // Remove the layer's image graph along with it (no FK cascade client-side).
  await removeBy('image_nodes', 'layer', id)
  await removeBy('image_connections', 'layer', id)
  await remove('layers', id)

  if (redirect) {
    nextRedirect(redirect)
  }

  return { ok: true, message: 'Layer deleted' }
}

export async function deleteLayerBySlug(versionId: string, layerSlug: string) {
  const layers = await getAllBy<Layer>('layers', 'version', versionId)
  const layer = layers.find((l) => l.slug === layerSlug)
  if (!layer) {
    return { ok: false, message: 'Unknown layer' }
  }
  return deleteLayer(layer.id)
}
