import { db } from '@/db/client'
import { nfts as nftsTable } from '@/db/schemas/nfts'
import type { NftInsert } from '@/db/schemas/nfts'
import { type Result, tryCatchAsync } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'

//TODO: Add updating of nfts
export async function insertNFTs(nfts: NftInsert[]): Promise<Result<string>> {
  return await tryCatchAsync(async () => {
    if (nfts.length === 0) {
      return new Ok('success')
    }
    await db.insert(nftsTable).values(nfts).onConflictDoNothing()
    return new Ok('success')
  })
}
