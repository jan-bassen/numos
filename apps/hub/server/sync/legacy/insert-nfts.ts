import { db } from '@/db/client'
import { nfts as nftsTable } from '@/db/schemas/nfts'
import type { NftInsert } from '@/db/schemas/nfts'
import { tryCatchAsync } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'

export async function insertNFTs(nfts: NftInsert[]) {
  return await tryCatchAsync(async () => {
    if (nfts.length === 0) {
      return new Ok([])
    }
    await db.insert(nftsTable).values(nfts)
    return new Ok(nfts)
  })
}
