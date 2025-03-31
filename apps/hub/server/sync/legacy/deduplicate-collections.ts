import type { CollectionInsert } from '@/db/schemas/collections'

export async function deduplicateCollections(collections: CollectionInsert[]) {
  const newCollections: CollectionInsert[] = []
  for (const collection of collections) {
    if (
      newCollections.find(
        (c) => c.address === collection.address && c.chain === collection.chain,
      )
    ) {
      continue
    }
    newCollections.push(collection)
  }
  return newCollections
}
