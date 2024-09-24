'use server'

import type {
  Collection,
  ExtendedCollection,
  InsertCollection,
  NewVersion,
  ReturnInfo,
  UpdateCollection,
  Version,
} from '@/types/database.types'
import { FetchError } from '@/lib/errors'
import { revalidatePath } from 'next/cache'
import { Json } from '../../../types/database-generated.types'
import { notFound, redirect } from 'next/navigation'
import { createSupabaseServerComponentClient } from '../server-client'
import { SavedGraph } from '@/types/nodes.types'
import { deleteFolder } from '../storage/user-images'
import { createSupabaseServiceClient } from '../service-client'
import { getFirstAccountId } from './accounts'

export const isCollectionSlugTaken = async (slug: string) => {
  const supabase = await createSupabaseServiceClient()
  const { data, error } = await supabase
    .from('collections')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw new FetchError('Error with fetching collection')
  }
  return !!data
}

export async function insertCollection(
  collection: InsertCollection,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const accountId = await getFirstAccountId()
  const { data, error } = await supabase
    .from('collections')
    .insert({ ...collection, account: accountId })
  if (error) {
    return { ok: false, message: error.message }
  }
  return { ok: true, message: 'Successfully created' }
}

async function upsertCollection(
  collection: InsertCollection,
  version?: Omit<NewVersion, 'collection'>,
): Promise<ReturnInfo> {
  if (!collection.id && !version) {
    return {
      ok: false,
      message: 'No version provided for new collection',
    }
  }

  const supabase = await createSupabaseServerComponentClient()
  const { data: userRes, error: authError } = await supabase.auth.getUser()
  if (authError || !userRes?.user) {
    console.error('Error with fetching user', authError)
    redirect('/login')
  }

  const isTaken = await isCollectionSlugTaken(collection.slug)
  console.log('ISTAKEN?', isTaken)
  if (isTaken) {
    return {
      ok: false,
      message: 'This identifier is already taken, please choose another',
    }
  }

  const { data: collectionData, error: collectionError } = await supabase
    .from('collections')
    .upsert(collection)
    .select()
    .single()

  if (collectionError) {
    return {
      ok: false,
      message: collectionError.message,
    }
  }

  if (!collection.id) {
    const { data: versionData, error: versionError } = await supabase
      .from('versions')
      .insert({ ...version, collection: collectionData.id })
      .select()
      .single()

    if (versionError) {
      return {
        ok: false,
        message: versionError?.message || 'Error creating version',
      }
    }

    const { data: updateCollectionData, error: updateCollectionError } =
      await supabase
        .from('collections')
        .update({ editable_version: versionData.id })
        .eq('id', collectionData.id)

    if (updateCollectionError) {
      return {
        ok: false,
        message: updateCollectionError?.message || 'Error updating collection',
      }
    }
  }
  revalidatePath('/studio/[collection]')
  return {
    ok: true,
    message: 'Successfully saved',
  }
}

export async function updateCollection(
  collection: UpdateCollection,
): Promise<ReturnInfo> {
  if (!collection.id) {
    return {
      ok: false,
      message: 'No collection ID provided',
    }
  }
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('collections')
    .update(collection)
    .eq('id', collection.id)
  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }
  revalidatePath('/studio/[collection]', 'layout')
  revalidatePath('/studio/[collection]', 'page')
  revalidatePath('/studio/[collection]/settings', 'page')
  return {
    ok: true,
    message: 'Successfully saved',
  }
}

export async function getCollectionFromSlug(slug: string): Promise<Collection> {
  if (!slug) {
    throw new FetchError('No slug defined')
  }

  const supabase = await createSupabaseServerComponentClient()
  const { data: userRes, error: authError } = await supabase.auth.getUser()
  if (authError || !userRes?.user) {
    console.error('Error with fetching user', authError)
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('collections')
    .select()
    .eq('slug', slug)
    .single()
  if (error) {
    throw new FetchError('Error with fetching collection')
  }
  return data
}

export async function getAllExtendedCollections(): Promise<
  ExtendedCollection[]
> {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*, editable_version (*)')

  if (error) {
    throw new FetchError(`Error with fetching collections: ${error.message}`)
  }
  return data as unknown as ExtendedCollection[]
}

export async function getAllCollections(): Promise<Collection[]> {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase.from('collections').select()

  if (error) {
    throw new FetchError(`Error with fetching collections: ${error.message}`)
  }
  return data as unknown as Collection[]
}

export async function getLatestCollections(): Promise<ExtendedCollection[]> {
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('collections')
    .select('*, editable_version (*)')
    .order('created_at', { ascending: false })
    .range(0, 4)

  if (error) {
    throw new FetchError(`Error with fetching collections: ${error.message}`)
  }
  return data as unknown as ExtendedCollection[]
}

export async function deleteCollection(id: string): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const res = await deleteFolder(id)
  if (!res.ok) {
    return {
      ok: false,
      message: `Couldn't delete layers: ${res.message}`,
    }
  }

  const { error } = await supabase.from('collections').delete().eq('id', id)
  if (error) {
    return {
      ok: false,
      message: `Couldn't delete collection: ${error.message}`,
    }
  }

  revalidatePath('/studio/[collection]')
  return {
    ok: true,
    message: 'Successfully deleted',
  }
}

export async function getExtendedCollectionFromSlug(
  collectionSlug: string,
): Promise<ExtendedCollection> {
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('collections')
    .select(
      `
        *,
        editable_version (
          *
        )
      `,
    )
    .eq('slug', collectionSlug)
    .returns<ExtendedCollection[]>()
    .maybeSingle()

  if (error) {
    throw new FetchError('Error with fetching collection')
  }

  if (!data?.editable_version) notFound()

  return data
}

/* export async function getExtendedCollection(
  collectionId: string,
): Promise<ExtendedCollection> {
  const supabase = await createSupabaseServerComponentClient()

  const { data, error } = await supabase
    .from('collections')
    .select(
      `
        *,
        editable_version (
          *
        )
      `,
    )
    .eq('id', collectionId).single()

  if (error) {
    throw new FetchError('Error with fetching collection')
  }


  return data
} */

export const updateCollectionImage = async (
  collectionId: string,
  image: string,
): Promise<ReturnInfo> => {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('collections')
    .update({ image })
    .eq('id', collectionId)
  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }
  return {
    ok: true,
    message: 'Collection image updated',
  }
}

export async function getVersion(id: string): Promise<Version> {
  if (!id) {
    throw new FetchError('No version defined')
  }
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('versions')
    .select()
    .eq('id', id)
    .single()
  if (error) {
    throw new FetchError('Error with fetching version')
  }
  return data
}

export async function getAllVersions(collection: string): Promise<Version[]> {
  if (!collection) {
    throw new FetchError('No collection defined')
  }

  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('versions')
    .select()
    .eq('collection', collection)
  if (error) {
    throw new FetchError('Error with fetching versions')
  }
  return data
}
