import { tryCatch } from '@repo/shared/result/try'
import { nftInsertSchema } from '@/db/schemas/nfts'
import type { NftInsert } from '@/db/schemas/nfts'
import { Ok } from '@repo/shared/result/ok'
import type { Result } from '@repo/shared/result/try'
import { Err } from '@repo/shared/result/err'
import { Decimal } from 'decimal.js'
import type { ExtendedNft } from '@/server/sync/extend-nfts'
import type { Chain } from '@repo/shared/constants/chains'

export function transformNFT(
  nft: ExtendedNft,
  chain: Chain,
): Result<NftInsert, 'transformNFT'> {
  const result = tryCatch(() => {
    const nftInsert: NftInsert = {
      owner: nft.wallet,
      collection: nft.collectionId,
      tokenId: nft.tokenId,
      name: nft.name ?? '',
      description: nft.description ?? '',
      tokenUri: nft.tokenUri ?? '',
      alchemyRawMetadata: nft.raw,
      alchemyUpdatedAt: new Date(nft.timeLastUpdated),
      alchemyImage: nft.image,
    }
    /* const res = nftInsertSchema.safeParse(nftInsert)
    if (!res.success) {
      console.error(res.error)
    } */

    const validatedNftInsert = nftInsertSchema.safeParse(nftInsert)
    if (!validatedNftInsert.success) {
      return new Err('Failed to validate NFT', 'transformNFT', {
        internalMessage: validatedNftInsert.error.message,
        chain: chain,
        issues: validatedNftInsert.error.issues,
      })
    }
    return new Ok(validatedNftInsert.data)
  })
  if (!result.ok) {
    return result
  }
  return result
}

export function transformNFTs(nfts: ExtendedNft[], chain: Chain) {
  const errors: Err<'transformNFT'>[] = []
  const nftInserts: NftInsert[] = nfts
    .map((nft) => {
      const nftInsert = transformNFT(nft, chain)
      if (!nftInsert.ok) {
        errors.push(nftInsert)
        return
      }
      return nftInsert.value
    })
    .filter((nft): nft is NftInsert => nft !== undefined)
  return { nftInserts, errors }
}
