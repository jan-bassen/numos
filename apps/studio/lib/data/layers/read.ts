import { FetchError } from '@/lib/errors'
import type { LayerType } from '@/lib/schemas/layers/layer-schema'
import type { Layer } from '@/types/database.types'
import { getAllBy } from '@/lib/data/store'
import { getCollectionFromSlug } from '@/lib/data/collections'

export async function getLayerBySlugs(
  collection: string,
  layer: string,
): Promise<Layer | null> {
  const collectionRow = await getCollectionFromSlug(collection)
  if (!collectionRow.editable_version) return null
  const layers = await getAllBy<Layer>(
    'layers',
    'version',
    collectionRow.editable_version,
  )
  return layers.find((l) => l.slug === layer) ?? null
}

export async function getAllLayers(version: string): Promise<Layer[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const layers = await getAllBy<Layer>('layers', 'version', version)
  return layers.sort((a, b) => a.index - b.index)
}

export type LayerNavItem = {
  slug: string
  name: string | null
  type: LayerType | null
}

export async function getLayersForNav(
  collectionSlug: string,
): Promise<LayerNavItem[]> {
  if (!collectionSlug) {
    throw new FetchError('No collection defined')
  }
  const collection = await getCollectionFromSlug(collectionSlug)
  if (!collection.editable_version) {
    throw new FetchError('No editable version found')
  }
  const layers = await getAllBy<Layer>(
    'layers',
    'version',
    collection.editable_version,
  )
  return layers
    .sort((a, b) => b.index - a.index)
    .map((layer) => ({
      slug: layer.slug,
      name: layer.name,
      type: (layer.definition?.type as LayerType | undefined) ?? null,
    }))
}

export async function getLatestLayers(
  version: string,
  amount = 3,
): Promise<Layer[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const layers = await getAllBy<Layer>('layers', 'version', version)
  return layers
    .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
    .slice(0, amount)
}
