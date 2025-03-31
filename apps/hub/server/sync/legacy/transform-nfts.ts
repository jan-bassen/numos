import { tryCatch } from '@repo/shared/result/try'
import { nftInsertSchema } from '@/db/schemas/nfts'
import type { NftInsert } from '@/db/schemas/nfts'
import { Ok } from '@repo/shared/result/ok'
import type { Result } from '@repo/shared/result/try'
import type { OwnedNft } from 'alchemy-sdk'
import { Err } from '@repo/shared/result/err'
import { Decimal } from 'decimal.js'

export type ExtendedNft = OwnedNft & {
  collectionId: number
}

export function extendNFT(nft: OwnedNft, collectionId: number): ExtendedNft {
  return {
    ...nft,
    collectionId,
  }
}

export function transformNFT(
  nft: ExtendedNft,
  walletId: number,
): Result<NftInsert> {
  const tokenId = new Decimal(nft.tokenId).toNumber()
  if (tokenId >= 9007199254740991) {
    return new Err('Token ID is too large')
  }

  const nftInsert: NftInsert = {
    owner: walletId,
    collection: nft.collectionId,
    tokenId,
    name: nft.name ?? '',
    description: nft.description ?? '',
    tokenUri: nft.tokenUri ?? '',
    alchemyRawMetadata: nft.raw,
    alchemyUpdatedAt: new Date(nft.timeLastUpdated),
    alchemyImage: nft.image,
  }
  const validatedNftInsert = nftInsertSchema.parse(nftInsert)
  return new Ok(validatedNftInsert)
}

export function transformNFTs(
  nfts: ExtendedNft[],
  walletId: number,
): Result<NftInsert[]> {
  return tryCatch(() => {
    const nftInserts: NftInsert[] = nfts
      .map((nft) => {
        const nftInsert = transformNFT(nft, walletId)
        if (!nftInsert.ok) {
          // TODO: Log error
          console.error(nftInsert)
          return
        }
        return nftInsert.value
      })
      .filter((nft) => nft !== undefined)
    return new Ok(nftInserts)
  })
}
