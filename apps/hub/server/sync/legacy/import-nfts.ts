import { insertNFTs } from '@/server/sync/legacy/insert-nfts'
import { transformCollections } from '@/server/sync/legacy/transform-collections'
import { getNFTsOnChain } from '@/server/sync/legacy/get-nfts'
import type { Chain } from '@repo/shared/constants/chains'
import type { Wallet } from '@/db/schemas/wallets'
import { transformNFTs } from '@/server/sync/legacy/transform-nfts'
import { extendNFTs } from '@/server/sync/legacy/extend-nfts'
import { insertCollections } from '@/server/sync/legacy/insert-collections'
import { Ok } from '@repo/shared/result/ok'
import type { Result } from '@repo/shared/result/try'
import type { SerializedErr } from '@repo/shared/result/err'
import { filterCollections } from '@/server/sync/legacy/filter-collections'
import { deduplicateCollections } from '@/server/sync/legacy/deduplicate-collections'
import { filterNfts } from '@/server/sync/legacy/filter-nfts'

export type ImportNFTsResult = {
  importedNfts: number
  newCollections: number
  failedImports: SerializedErr[]
}

export async function importNFTs(
  chain: Chain,
  wallet: Wallet,
): Promise<Result<ImportNFTsResult>> {
  const rawNfts = await getNFTsOnChain(chain, wallet.address)
  if (!rawNfts.ok) {
    return rawNfts
  }

  const filterResult = await filterCollections(chain, rawNfts.value)
  if (!filterResult.ok) {
    return filterResult
  }

  const { filteredNfts: collectionFilteredNfts, existingCollections } =
    filterResult.value

  const collections = transformCollections(chain, collectionFilteredNfts)
  if (!collections.ok) {
    return collections
  }

  const uniqueCollections = await deduplicateCollections(collections.value)

  const collectionIds = await insertCollections(uniqueCollections)
  if (!collectionIds.ok) {
    return collectionIds
  }

  const extendedNfts = await extendNFTs(
    rawNfts.value,
    collectionIds.value,
    existingCollections,
  )
  if (!extendedNfts.ok) {
    return extendedNfts
  }

  //TODO: handle errors
  console.error(extendedNfts.value.errors)

  const filteredNfts = await filterNfts(extendedNfts.value.nfts, wallet.id, [
    ...collectionIds.value,
    ...existingCollections,
  ])
  if (!filteredNfts.ok) {
    return filteredNfts
  }

  const transformedNfts = transformNFTs(
    filteredNfts.value.filteredNfts,
    wallet.id,
  )
  if (!transformedNfts.ok) {
    return transformedNfts
  }

  const insertedNfts = await insertNFTs(transformedNfts.value)
  if (!insertedNfts.ok) {
    return insertedNfts
  }

  return new Ok({
    importedNfts: insertedNfts.value.length,
    newCollections: collections.value.length,
    failedImports: extendedNfts.value.errors,
  })
}
