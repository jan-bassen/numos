import type {
  Action,
  Attribute,
  Collection,
  ExtendedCollection,
  InsertCollection,
  Layer,
  ReturnInfo,
  UpdateCollection,
  Upload,
  Version,
} from '@/types/database.types'
import { FetchError } from '@/lib/errors'
import { notFound } from 'next/navigation'
import { getFirstAccountId } from './accounts'
import {
  get,
  getAll,
  getAllBy,
  newId,
  patch,
  put,
  remove,
  removeBy,
  removeBlob,
} from './store'

const now = () => new Date().toISOString()

export const isCollectionSlugTaken = async (slug: string) => {
  const collections = await getAllBy<Collection>('collections', 'slug', slug)
  return collections.length > 0
}

export async function insertCollection(
  collection: InsertCollection,
): Promise<ReturnInfo> {
  const accountId = await getFirstAccountId()
  const collectionId = collection.id ?? newId()
  const versionId = newId()

  // Mirror the former Postgres trigger: every new collection gets an editable
  // version created and linked.
  const version: Version = {
    id: versionId,
    collection: collectionId,
    name: collection.name ?? null,
    description: collection.description ?? null,
    banner: null,
    external_link: null,
    featured: null,
    image: null,
    locked: false,
    major: 1,
    minor: 0,
    patch: 0,
    status: 'development',
    created_at: now(),
    updated_at: now(),
  }

  const newCollection: Collection = {
    id: collectionId,
    account: accountId,
    slug: collection.slug,
    name: collection.name ?? null,
    description: collection.description ?? null,
    symbol: collection.symbol ?? null,
    external_link: collection.external_link ?? null,
    image: collection.image ?? null,
    banner: null,
    max_supply: collection.max_supply ?? null,
    editable_version: versionId,
    settings_locked: false,
    created_at: now(),
    updated_at: now(),
  }

  await put('versions', version)
  await put('collections', newCollection)
  return { ok: true, message: 'Successfully created' }
}

export async function updateCollection(
  collection: UpdateCollection,
): Promise<ReturnInfo> {
  if (!collection.id) {
    return { ok: false, message: 'No collection ID provided' }
  }
  const updated = await patch<Collection>('collections', collection.id, {
    ...collection,
    updated_at: now(),
  })
  if (!updated) {
    return { ok: false, message: 'Collection not found' }
  }
  return { ok: true, message: 'Successfully saved' }
}

export async function setCollectionSettingsLock(id: string, locked: boolean) {
  const updated = await patch<Collection>('collections', id, {
    settings_locked: locked,
  })
  if (!updated) {
    return { ok: false, message: 'Collection not found' }
  }
  return { ok: true, message: 'Successfully updated' }
}

export async function getCollectionFromSlug(slug: string): Promise<Collection> {
  if (!slug) {
    throw new FetchError('No slug defined')
  }
  const [collection] = await getAllBy<Collection>('collections', 'slug', slug)
  if (!collection) {
    throw new FetchError('Error with fetching collection')
  }
  return collection
}

export async function getVersionIdFromCollectionSlug(
  slug: string,
): Promise<string> {
  if (!slug) {
    throw new FetchError('No slug defined')
  }
  const collection = await getCollectionFromSlug(slug)
  if (!collection.editable_version) {
    throw new FetchError('Error with fetching collection')
  }
  return collection.editable_version
}

async function extendCollection(
  collection: Collection,
): Promise<ExtendedCollection> {
  const version = collection.editable_version
    ? await get<Version>('versions', collection.editable_version)
    : undefined
  return {
    ...collection,
    editable_version: version ?? null,
  } as unknown as ExtendedCollection
}

export async function getAllExtendedCollections(): Promise<
  ExtendedCollection[]
> {
  const collections = await getAll<Collection>('collections')
  return Promise.all(collections.map(extendCollection))
}

export async function getAllCollections(): Promise<Collection[]> {
  return getAll<Collection>('collections')
}

export async function getLatestCollections(): Promise<ExtendedCollection[]> {
  const collections = await getAll<Collection>('collections')
  const latest = collections
    .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
    .slice(0, 5)
  return Promise.all(latest.map(extendCollection))
}

async function cascadeDeleteCollection(id: string): Promise<void> {
  const versions = await getAllBy<Version>('versions', 'collection', id)
  for (const version of versions) {
    const actions = await getAllBy<Action>('actions', 'version', version.id)
    for (const action of actions) {
      await removeBy('action_nodes', 'action', action.id)
      await removeBy('action_connections', 'action', action.id)
    }
    const layers = await getAllBy<Layer>('layers', 'version', version.id)
    for (const layer of layers) {
      await removeBy('image_nodes', 'layer', layer.id)
      await removeBy('image_connections', 'layer', layer.id)
    }
    const uploads = await getAllBy<Upload>('uploads', 'version', version.id)
    for (const upload of uploads) {
      await removeBlob(upload.id)
    }
    await removeBy('actions', 'version', version.id)
    await removeBy('attributes', 'version', version.id)
    await removeBy('layers', 'version', version.id)
    await removeBy('uploads', 'version', version.id)
    await removeBy('folders', 'version', version.id)
    await remove('versions', version.id)
  }
  await remove('collections', id)
}

export async function deleteCollection(id: string): Promise<ReturnInfo> {
  const collection = await get<Collection>('collections', id)
  if (!collection) {
    return { ok: false, message: "Couldn't delete collection: not found" }
  }
  await cascadeDeleteCollection(id)
  return { ok: true, message: 'Successfully deleted' }
}

export async function deleteCollectionBySlug(
  slug: string,
): Promise<ReturnInfo> {
  const collection = await getCollectionFromSlug(slug)
  return deleteCollection(collection.id)
}

export async function getExtendedCollectionFromSlug(
  collectionSlug: string,
): Promise<ExtendedCollection> {
  const [collection] = await getAllBy<Collection>(
    'collections',
    'slug',
    collectionSlug,
  )
  if (!collection) {
    notFound()
  }
  const extended = await extendCollection(collection)
  if (!extended.editable_version) notFound()
  return extended
}

export const updateCollectionImage = async (
  collectionId: string,
  image: string,
): Promise<ReturnInfo> => {
  const updated = await patch<Collection>('collections', collectionId, {
    image,
  })
  if (!updated) {
    return { ok: false, message: 'Collection not found' }
  }
  return { ok: true, message: 'Collection image updated' }
}

export async function getVersion(id: string): Promise<Version> {
  if (!id) {
    throw new FetchError('No version defined')
  }
  const version = await get<Version>('versions', id)
  if (!version) {
    throw new FetchError('Error with fetching version')
  }
  return version
}

export async function getAllVersions(collection: string): Promise<Version[]> {
  if (!collection) {
    throw new FetchError('No collection defined')
  }
  return getAllBy<Version>('versions', 'collection', collection)
}
