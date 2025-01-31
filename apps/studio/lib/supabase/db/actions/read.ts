import type { Action, TriggerType } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { FetchError } from '@/lib/errors'
import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import 'server-only'

export async function getAllActions(version: string): Promise<Action[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('actions')
    .select()
    .eq('version', version)
    .order('name', { ascending: true })

  if (error) {
    throw new FetchError('error with fetch')
  }
  return data
}

export async function getLatestActions(
  version: string,
  amount = 3,
): Promise<Action[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const index = amount - 1
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('actions')
    .select()
    .eq('version', version)
    .order('updated_at', { ascending: false })
    .range(0, index)
    .returns<Action[]>()

  if (error) {
    throw new FetchError('error with fetch')
  }
  return data
}

export async function getActionBySlugs(
  collection: string,
  action: string,
): Promise<Action | null> {
  if (!action || !collection) {
    throw new FetchError('No action or collection defined')
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .rpc('action_from_slugs', {
      collection_slug: collection,
      action_slug: action,
    })
    .returns<Action | null>()

  if (error) {
    throw new FetchError('error with fetch')
  }

  if (!data || !data.id) return null
  return data
}

export type ActionNavItem = {
  slug: string
  name: string | null
  type: TriggerType | null
}
export async function getActionsForNav(
  collectionSlug: string,
): Promise<ActionNavItem[]> {
  if (!collectionSlug) {
    throw new FetchError('No collection defined')
  }
  const collection = await getCollectionFromSlug(collectionSlug)
  if (!collection.editable_version) {
    throw new FetchError('No editable version found')
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('actions')
    .select('name, slug, trigger->type')
    .eq('version', collection.editable_version)
    .order('trigger->type', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw new FetchError('Error with loading actions')
  }
  return data as unknown as {
    slug: string
    name: string | null
    type: TriggerType | null
  }[]
}

export async function getActionBySlug(
  slug: string,
  version: string,
): Promise<Action> {
  if (!slug) {
    throw new FetchError('No action defined')
  }
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('actions')
    .select()
    .eq('slug', slug)
    .eq('version', version)
    .returns<Action[]>()

  if (error) {
    throw new FetchError('Error with loading action')
  }
  if (data.length > 1) {
    throw new FetchError('Multiple actions found')
  }
  const action = data[0]
  if (!action) throw new FetchError('Action not found')
  return action
}
