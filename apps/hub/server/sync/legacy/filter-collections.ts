import { db } from '@/db/client'
import { collections } from '@/db/schemas/collections'
import { and, eq, inArray } from 'drizzle-orm'
import type { Chain } from '@repo/shared/constants/chains'
import type { OwnedNft } from 'alchemy-sdk'
import { type Result, tryCatchAsync } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'

export async function filterCollections(
  chain: Chain,
  nfts: OwnedNft[],
): Promise<
  Result<{
    filteredNfts: OwnedNft[]
    existingCollections: { id: number; address: string }[]
  }>
> {
  const collectionAddresses = nfts.map((nft) => nft.contract.address)
  const existingCollections = await tryCatchAsync(
    async () =>
      new Ok(
        await db.query.collections.findMany({
          where: and(
            eq(collections.chain, chain),
            inArray(collections.address, collectionAddresses),
          ),
          columns: {
            id: true,
            address: true,
          },
        }),
      ),
  )
  if (!existingCollections.ok) {
    return existingCollections
  }
  const existingCollectionAddresses = existingCollections.value.map(
    (collection) => collection.address,
  )
  const filteredNfts = nfts.filter(
    (nft) => !existingCollectionAddresses.includes(nft.contract.address),
  )
  return new Ok({
    filteredNfts,
    existingCollections: existingCollections.value,
  })
}
