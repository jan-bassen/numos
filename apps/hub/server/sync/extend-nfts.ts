import { db } from '@/db/client'
import { collections } from '@/db/schemas/collections'
import { Err } from '@repo/shared/result/err'
import { Ok } from '@repo/shared/result/ok'
import type { OwnedNft } from 'alchemy-sdk'
import { and, eq, inArray } from 'drizzle-orm'
import type { Result } from '@repo/shared/result/try'
import type { Chain } from '@repo/shared/constants/chains'

export type ExtendedNft = OwnedNft & {
  wallet: number
  collectionId: number
}

export async function extendNFTs(
  chain: Chain,
  nfts: (OwnedNft & { wallet: number })[],
  insertedCollections: { address: string; id: number }[],
): Promise<
  Result<{
    extendedNfts: ExtendedNft[]
    errors: Err<'dataMissmatch'>[]
  }>
> {
  const errors: Err<'dataMissmatch'>[] = []
  const extendedNfts: ExtendedNft[] = []

  // Create a lookup map for faster access to collection IDs by address
  const collectionMap = new Map<string, number>()
  const missingAddresses: string[] = []

  // Add inserted collections to the map
  for (const collection of insertedCollections) {
    collectionMap.set(collection.address, collection.id)
  }

  for (const nft of nfts) {
    const contractAddress = nft.contract.address
    if (!collectionMap.has(contractAddress)) {
      missingAddresses.push(contractAddress)
    }
  }

  if (missingAddresses.length > 0) {
    try {
      // Fetch all missing collections at once using inArray
      const fetchedCollections = await db.query.collections.findMany({
        where: and(
          inArray(collections.address, missingAddresses),
          eq(collections.chain, chain),
        ),
        columns: {
          id: true,
          address: true,
        },
      })

      for (const collection of fetchedCollections) {
        collectionMap.set(collection.address, collection.id)
      }
    } catch (error) {
      return new Err('Failed to fetch missing collections', 'dataMissmatch', {
        internalMessage: error instanceof Error ? error.message : String(error),
      })
    }
  }

  // Extend NFTs with collection IDs
  for (const nft of nfts) {
    const contractAddress = nft.contract.address
    const collectionId = collectionMap.get(contractAddress)

    if (!collectionId) {
      /* console.log(nft) */
      errors.push(
        new Err('Collection ID missing when extending NFT', 'dataMissmatch', {
          internalMessage: `Collection with address ${nft.contract.address} not found when extending NFT ${nft.tokenId}`,
        }),
      )
      continue
    }

    extendedNfts.push({
      ...nft,
      collectionId,
    })
  }

  return new Ok({ extendedNfts, errors })
}
