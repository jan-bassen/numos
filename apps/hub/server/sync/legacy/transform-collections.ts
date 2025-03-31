import type { CollectionInsert, SpamReason } from '@/db/schemas/collections'
import { Ok } from '@repo/shared/result/ok'
import { type Result, tryCatch } from '@repo/shared/result/try'
import type { OwnedNft } from 'alchemy-sdk'
import type { AnyChain } from '@repo/shared/constants/chains'
import { Decimal } from 'decimal.js'

export function transformCollections(
  chain: AnyChain,
  nfts: OwnedNft[],
): Result<CollectionInsert[]> {
  return tryCatch(() => {
    const collections: CollectionInsert[] = nfts.map((nft) => {
      const collection: CollectionInsert = {
        name: nft.contract.name,
        symbol: nft.contract.symbol,
        chain,
        address: nft.contract.address,
        slug:
          nft.collection?.slug || nft.contract.openSeaMetadata.collectionSlug,
        externalUrl:
          nft.collection?.externalUrl ||
          nft.contract.openSeaMetadata.externalUrl,
        imageUrl: nft.contract.openSeaMetadata.imageUrl,
        bannerImageUrl:
          nft.collection?.bannerImageUrl ||
          nft.contract.openSeaMetadata.bannerImageUrl,
        totalSupply: nft.contract.totalSupply
          ? new Decimal(nft.contract.totalSupply).toNumber()
          : null,
        spam:
          nft.contract.isSpam === undefined
            ? undefined
            : {
                spam: nft.contract.isSpam,
                spamReason: nft.contract.spamClassifications as SpamReason[],
              },
      }
      return collection
    })
    return new Ok(collections)
  })
}
