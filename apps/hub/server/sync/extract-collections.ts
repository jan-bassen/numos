import {
  collectionInsertSchema,
  collections,
  type CollectionInsert,
  type SpamReason,
} from '@/db/schemas/collections'
import { Ok } from '@repo/shared/result/ok'
import { type Result, tryCatch } from '@repo/shared/result/try'
import type { OwnedNft } from 'alchemy-sdk'
import type { AnyChain } from '@repo/shared/constants/chains'
import { Decimal } from 'decimal.js'
import { Err } from '@repo/shared/result/err'

export function transformCollection(
  chain: AnyChain,
  nft: OwnedNft,
): Result<CollectionInsert, 'transformCollection'> {
  const result = tryCatch(() => {
    const collection: CollectionInsert = {
      name: nft.contract.name,
      symbol: nft.contract.symbol,
      chain,
      address: nft.contract.address,
      slug: nft.collection?.slug || nft.contract.openSeaMetadata.collectionSlug,
      externalUrl:
        nft.collection?.externalUrl || nft.contract.openSeaMetadata.externalUrl,
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

    const validatedCollection = collectionInsertSchema.parse(collection)
    return new Ok(validatedCollection)
  })

  if (!result.ok) {
    return new Err('Failed to transform collection', 'transformCollection', {
      internalMessage: result.message,
      chain,
      issues: result.data?.issues ?? [],
    })
  }

  return result
}

export function extractCollections(
  chain: AnyChain,
  nfts: (OwnedNft & { wallet: number })[],
): {
  collections: CollectionInsert[]
  errors: Err<'transformCollection'>[]
} {
  const seenCollections = new Set<string>()
  const collections: CollectionInsert[] = []
  const errors: Err<'transformCollection'>[] = []

  for (const nft of nfts) {
    const result = transformCollection(chain, nft)
    if (result.ok) {
      const collection = result.value
      if (!seenCollections.has(collection.address)) {
        seenCollections.add(collection.address)
        collections.push(collection)
      }
    } else {
      errors.push(result)
    }
  }

  return { collections, errors }
}
