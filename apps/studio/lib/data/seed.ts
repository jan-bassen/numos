'use client'

import type { Collection } from '@/types/database.types'
import { seedBloomLab } from './bloom-seed'
import { getAll } from './store'

/**
 * Populates the store with the Bloom Lab sample collection the first time a
 * visitor loads the app. Idempotent: runs only when no collections exist yet
 * (i.e. a fresh visitor or after a data reset).
 */
export async function seedIfEmpty(): Promise<void> {
  const existing = await getAll<Collection>('collections')
  if (existing.length > 0) return

  await seedBloomLab()
}
