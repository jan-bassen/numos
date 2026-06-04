'use client'

import type {
  Action,
  Attribute,
  Collection,
  Layer,
  Profile,
  Upload,
  Version,
} from '@/types/database.types'
import type { Tables } from '@/types/database.types'
import {
  DEMO_ACCOUNT_ID,
  DEMO_PROFILE,
  DEMO_USER_ID,
} from './demo-constants'
import { getAll, newId, putBlob, bulkPut, put } from './store'

const now = () => new Date().toISOString()

const COLLECTION_ID = '00000000-0000-4000-8000-000000000100'
const VERSION_ID = '00000000-0000-4000-8000-000000000101'

/**
 * Populates the store with a sample collection the first time a visitor loads the
 * app, so the studio is never empty. Idempotent: runs only when no collections
 * exist yet (i.e. a fresh visitor or after a data reset).
 */
export async function seedIfEmpty(): Promise<void> {
  const existing = await getAll<Collection>('collections')
  if (existing.length > 0) return

  const account: Tables<'accounts'> = {
    id: DEMO_ACCOUNT_ID,
    owner: DEMO_USER_ID,
    created_at: now(),
  }

  const profile: Profile = { ...DEMO_PROFILE, updated_at: now() }

  const version: Version = {
    id: VERSION_ID,
    collection: COLLECTION_ID,
    name: 'v1',
    description: null,
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

  const collection: Collection = {
    id: COLLECTION_ID,
    account: DEMO_ACCOUNT_ID,
    slug: 'demo',
    name: 'Demo Collection',
    description: 'A sample collection to explore the studio.',
    symbol: 'DEMO',
    external_link: null,
    image: null,
    banner: null,
    max_supply: 1000,
    editable_version: VERSION_ID,
    settings_locked: false,
    created_at: now(),
    updated_at: now(),
  }

  const attributes: Attribute[] = [
    {
      id: newId(),
      version: VERSION_ID,
      slug: 'background',
      name: 'Background',
      description: 'The background colour of the token.',
      display: 'public',
      token_specific: true,
      locked: false,
      settings: null,
      value: { type: 'color', list: false, optional: false } as never,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: newId(),
      version: VERSION_ID,
      slug: 'level',
      name: 'Level',
      description: 'A numeric trait that can change over time.',
      display: 'public',
      token_specific: true,
      locked: false,
      settings: null,
      value: { type: 'number', list: false, optional: false } as never,
      created_at: now(),
      updated_at: now(),
    },
  ]

  const action: Action = {
    id: newId(),
    version: VERSION_ID,
    slug: 'level-up',
    name: 'Level Up',
    description: 'Increase the level attribute.',
    trigger: null,
    locked: false,
    created_at: now(),
    updated_at: now(),
  }

  const layer: Layer = {
    id: newId(),
    version: VERSION_ID,
    slug: 'base',
    name: 'Base',
    description: 'The base image layer.',
    definition: { type: 'custom' } as never,
    index: 0,
    locked: false,
    created_at: now(),
    updated_at: now(),
  }

  const uploadId = newId()
  const upload: Upload = {
    id: uploadId,
    version: VERSION_ID,
    folder: null,
    name: 'Flower',
    type: 'jpeg',
    bytes: 0,
    width: 800,
    height: 800,
    tags: null,
    created_at: now(),
    updated_at: now(),
  }

  await put('accounts', account)
  await put('profiles', profile)
  await put('versions', version)
  await put('collections', collection)
  await bulkPut('attributes', attributes)
  await put('actions', action)
  await put('layers', layer)

  // Seed one upload from a bundled asset so the uploads tab is non-empty.
  try {
    const res = await fetch('/example_flower.jpg')
    if (res.ok) {
      const blob = await res.blob()
      await putBlob(uploadId, blob)
      upload.bytes = blob.size
      await put('uploads', upload)
    }
  } catch {
    // Asset unavailable — skip the sample upload, the rest of the demo is fine.
  }
}
