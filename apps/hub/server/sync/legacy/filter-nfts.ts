import 'server-only'
import { and, eq, inArray } from 'drizzle-orm'
import { tryCatchAsync } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'
import { db } from '@/db/client'
import type { ExtendedNft } from '@/server/sync/legacy/transform-nfts'
import { nfts as nftsTable } from '@/db/schemas/nfts'

export async function filterNfts(
  nfts: ExtendedNft[],
  wallet: number,
  collections: { address: string; id: number }[],
) {
  const collectionIds = collections.map((c) => c.id)
  return await tryCatchAsync(async () => {
    const existingNfts = await db.query.nfts.findMany({
      columns: {
        id: true,
        tokenId: true,
      },
      where: and(
        eq(nftsTable.owner, wallet),
        inArray(nftsTable.collection, collectionIds),
      ),
      with: {
        collection: {
          columns: {
            address: true,
          },
        },
      },
    })
    const filteredNfts = nfts.filter(
      (nft) =>
        !existingNfts.some(
          (existingNft) =>
            existingNft.tokenId === Number(nft.tokenId) &&
            existingNft.collection.address === nft.contract.address,
        ),
    )
    return new Ok({
      filteredNfts,
      existingNfts,
    })
  })
}
