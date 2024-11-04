'use server'

import { FetchError } from '@/lib/errors'
import { getCollectionFromSlug } from './collections'
import type {
  Action,
  InsertAction,
  ReturnInfo,
  TriggerType,
  UpdateAction,
} from '@/types/database.types'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerComponentClient } from '../server-client'
import { redirect } from 'next/navigation'
import type { ActionTrigger } from '@/types/actions.types'

const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

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

export async function getAllActionsBySlug(
  collectionSlug: string,
): Promise<Action[]> {
  if (!collectionSlug) {
    throw new FetchError('No collection defined')
  }
  const collection = await getCollectionFromSlug(collectionSlug)
  if (!collection.editable_version) {
    throw new FetchError('No editable version found')
  }
  const actions = await getAllActions(collection.editable_version)
  return actions
}

export async function getActionsForNav(
  collectionSlug: string,
): Promise<{ slug: string; name: string | null; type: TriggerType | null }[]> {
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

export async function upsertBasicAction(
  action: InsertAction,
): Promise<ReturnInfo> {
  if (!action.slug) {
    return { ok: false, message: 'No slug defined' }
  }

  if (!regex.test(action.slug)) {
    return {
      ok: false,
      message: 'Slug can only contain lowercase letters, numbers, and dashes',
    }
  }

  const supabase = await createSupabaseServerComponentClient()

  const { data: allSlugs, error: fetchAllSlugsError } = await supabase
    .from('actions')
    .select('id, slug')
    .eq('version', action.version)

  if (fetchAllSlugsError) {
    throw new FetchError('Error with fetching slug data')
  }
  if (
    allSlugs.some(
      (act: { slug: string; id: string }) =>
        act.slug === action.slug && act.id !== action.id,
    )
  ) {
    return { ok: false, message: 'Too similar name already in use' }
  }

  const { error } = await supabase.from('actions').upsert(action)

  if (error) {
    console.error(error)
    throw new FetchError('Error with inserting new action')
  }

  revalidatePath('/collections/[collection]/actions/[action]')

  return {
    ok: true,
    message: 'Successfully created new action!',
  }
}

export async function insertAction(action: InsertAction): Promise<ReturnInfo> {
  if (!action.slug) {
    return { ok: false, message: 'No slug defined' }
  }
  if (action.slug === 'new') {
    return { ok: false, message: "Slug cannot be 'new'" }
  }

  if (!regex.test(action.slug)) {
    return {
      ok: false,
      message: 'Slug can only contain lowercase letters, numbers, and dashes',
    }
  }

  const supabase = await createSupabaseServerComponentClient()

  const { data: allSlugs, error: fetchAllSlugsError } = await supabase
    .from('actions')
    .select('id, slug')
    .eq('version', action.version)

  if (fetchAllSlugsError) {
    console.log(fetchAllSlugsError)
    throw new FetchError('Error with fetching slug data')
  }
  if (
    allSlugs.some(
      (act: { slug: string; id: string }) =>
        act.slug === action.slug && act.id !== action.id,
    )
  ) {
    return { ok: false, message: 'Too similar name already in use' }
  }

  const { error } = await supabase.from('actions').upsert(action)

  if (error) {
    console.error(error)
    throw new FetchError('Error with inserting new action')
  }

  revalidatePath('/collections/[collection]/actions/[action]')

  return {
    ok: true,
    message: 'Successfully created new action!',
  }
}

export async function updateActionSettings(
  id: string,
  trigger: ActionTrigger,
): Promise<ReturnInfo> {
  if (!id) {
    return {
      ok: false,
      message: 'No action ID provided',
    }
  }
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('actions')
    .update({
      trigger: trigger,
    })
    .eq('id', id)

  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }
  revalidatePath('/collections/[collection]/actions/[action]')
  return {
    ok: true,
    message: 'Successfully saved',
  }
}

export async function editAction(action: UpdateAction) {
  if (!action.id) {
    return {
      ok: false,
      message: 'No action ID provided',
    }
  }
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('actions')
    .update(action)
    .eq('id', action.id)

  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }
  revalidatePath('/collections/[collection]/actions/[action]', 'page')
  return {
    ok: true,
    message: 'Successfully updated',
  }
}

export async function deleteAction(id: string, collectionSlug: string) {
  if (!id) {
    throw new FetchError('No action defined')
  }
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('actions').delete().eq('id', id)

  if (error) {
    throw new FetchError('Error with deleting action')
  }
  redirect(`/collections/${collectionSlug}/actions`)
}
