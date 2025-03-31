import { db } from '@/db/client'
import { collections as CollectionsTable } from '@/db/schemas/collections'
import type { CollectionInsert } from '@/db/schemas/collections'
import { Ok } from '@repo/shared/result/ok'
import { tryCatchAsync } from '@repo/shared/result/try'

export async function insertCollections(collections: CollectionInsert[]) {
  return await tryCatchAsync(async () => {
    if (collections.length === 0) {
      return new Ok([])
    }
    const res = await db
      .insert(CollectionsTable)
      .values(collections)
      .returning({ id: CollectionsTable.id, address: CollectionsTable.address })
    return new Ok(res)
  })
}
