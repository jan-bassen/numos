'use server'

import 'server-only'
import { FetchError } from '@/lib/errors'
import type { InsertLayer, UnorderedInsertLayer } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { hrefRegex, type ReturnInfo } from '@repo/ui/lib/utils'

export async function insertLayer(layer: InsertLayer): Promise<ReturnInfo> {
  if (!layer.slug) {
    return { ok: false, message: 'No slug defined' }
  }
  if (!hrefRegex.test(layer.slug)) {
    return {
      ok: false,
      message: 'Slug can only contain lowercase letters, numbers, and dashes',
    }
  }

  const supabase = await createSupabaseServerComponentClient()

  const { data: slugCheck, error: slugCheckError } = await supabase
    .from('layers')
    .select()
    .eq('version', layer.version)
    .eq('slug', layer.slug)
    .maybeSingle()

  if (slugCheckError) {
    throw new FetchError('Error with fetching slug data')
  }
  if (slugCheck) {
    return { ok: false, message: 'Slug already exists' }
  }

  const { error } = await supabase.from('layers').insert(layer)

  if (error) {
    throw new FetchError('Error with inserting new layer')
  }

  return {
    ok: true,
    message: 'Successfully created',
  }
}

export async function getNextLayerIndex(version: string) {
  const supabase = await createSupabaseServerComponentClient()
  const { data: indexCheck, error: indexCheckError } = await supabase
    .from('layers')
    .select('index')
    .eq('version', version)
    .order('index', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (indexCheckError) {
    throw new FetchError('Error with fetching index data')
  }
  if (indexCheck === null) {
    return 0
  }
  return indexCheck.index + 1
}

export async function insertLayerAtTop(layer: UnorderedInsertLayer) {
  const index = await getNextLayerIndex(layer.version)
  return insertLayer({ ...layer, index })
}
