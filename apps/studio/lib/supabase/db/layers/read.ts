import 'server-only'
import { FetchError } from '@/lib/errors'
import type { LayerType } from '@/lib/schemas/layers/layer-schema'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import type { Layer } from '@/types/database.types'
import { getCollectionFromSlug } from '../collections'

export async function getLayerBySlugs(
  collection: string,
  layer: string,
): Promise<Layer | null> {
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .rpc('layer_from_slugs', {
      collection_slug: collection,
      layer_slug: layer,
    })
    .returns<Layer>()

  if (error) {
    throw new FetchError('error with getting layer by slugs')
  }
  return data
}

export async function getAllLayers(version: string): Promise<Layer[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('layers')
    .select()
    .eq('version', version)
    .order('index', { ascending: true })

  if (error) {
    throw new FetchError('error with fetch')
  }
  return data
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
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('layers')
    .select('name, slug, definition->type')
    .eq('version', collection.editable_version)
    .order('index', { ascending: false })

  if (error) {
    throw new FetchError('Error with loading layers')
  }
  return data as unknown as {
    slug: string
    name: string | null
    type: LayerType | null
  }[]
}

export async function getLatestLayers(
  version: string,
  amount = 3,
): Promise<Layer[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const index = amount - 1
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('layers')
    .select()
    .eq('version', version)
    .order('updated_at', { ascending: false })
    .range(0, index)
    .returns<Layer[]>()

  if (error) {
    throw new FetchError('error with fetch')
  }
  return data
}
