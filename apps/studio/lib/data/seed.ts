'use client'

import type { Collection } from '@/types/database.types'
import { migrateDemoActionGraphs, seedBloomLab } from './bloom-seed'
import { getAll, patch } from './store'

/**
 * Populates the store with the Flower Demo sample collection the first time a
 * visitor loads the app. Idempotent: runs only when no collections exist yet
 * (i.e. a fresh visitor or after a data reset).
 */
export async function seedIfEmpty(): Promise<void> {
  const existing = await getAll<Collection>('collections')
  if (existing.length > 0) {
    await migrateDemoActionGraphs()

    const bloomLab = existing.find(
      (collection) =>
        collection.slug === 'bloom-lab' && collection.name === 'Bloom Lab',
    )
    if (bloomLab) {
      await patch<Collection>('collections', bloomLab.id, {
        name: 'Flower Demo',
        updated_at: new Date().toISOString(),
      })
    }
    return
  }

  await seedBloomLab()
}
