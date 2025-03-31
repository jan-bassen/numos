import { db } from '@/db/client'
import { collections } from '@/db/schemas/collections'
import { Err, type SerializedErr } from '@repo/shared/result/err'
import { Ok } from '@repo/shared/result/ok'
import type { OwnedNft } from 'alchemy-sdk'
import { eq } from 'drizzle-orm'
import type { ExtendedNft } from '@/server/sync/legacy/transform-nfts'
import type { Result } from '@repo/shared/result/try'

export async function extendNFTs(
  nfts: OwnedNft[],
  insertedCollections: { address: string; id: number }[],
  existingCollections: { address: string; id: number }[],
): Promise<
  Result<{
    nfts: ExtendedNft[]
    errors: SerializedErr<'dataMissmatch'>[]
  }>
> {
  const errors: SerializedErr<'dataMissmatch'>[] = []
  const extendedNfts: ExtendedNft[] = []
  for (const nft of nfts) {
    const insertedCollection = insertedCollections.find(
      (c) => c.address === nft.contract.address,
    )
    const existingCollection = existingCollections.find(
      (c) => c.address === nft.contract.address,
    )

    const collectionId = insertedCollection?.id || existingCollection?.id
    if (!collectionId) {
      errors.push({
        message: `Collection with address ${nft.contract.address} not found when extending NFT ${nft.tokenId}`,
        type: 'dataMissmatch',
        data: {
          internalMessage: `Collection with address ${nft.contract.address} not found when extending NFT ${nft.tokenId}`,
        },
      })
      continue
    }
    extendedNfts.push({
      ...nft,
      collectionId,
    })
  }
  return new Ok({ nfts: extendedNfts, errors })
}
