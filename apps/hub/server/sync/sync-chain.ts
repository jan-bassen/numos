import type { Wallet } from '@/db/schemas/wallets'
import type { Chain } from '@repo/shared/constants/chains'
import { fetchNfts } from './fetch-nfts'
import { extractCollections } from '@/server/sync/extract-collections'
import type { Result } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'
import { insertCollections } from '@/server/sync/insert-collections'
import { extendNFTs } from '@/server/sync/extend-nfts'
import { insertNFTs } from '@/server/sync/insert-nfts'
import { transformNFTs } from './transform-nfts'
import type {
  Err,
  SerializedErr,
  SerializedErrResponse,
} from '@repo/shared/result/err'

export async function syncChain(
  chain: Chain,
  wallets: Wallet[],
): Promise<Result<{ status: string; errors: SerializedErr[] }>> {
  const { rawNfts, errors: fetchErrors } = await fetchNfts(chain, wallets)

  const { collections, errors: transformCollectionErrors } = extractCollections(
    chain,
    rawNfts,
  )

  const insertResult = await insertCollections(collections)

  if (!insertResult.ok) {
    return insertResult
  }

  const extendResult = await extendNFTs(chain, rawNfts, insertResult.value)

  if (!extendResult.ok) {
    return extendResult
  }

  const { extendedNfts, errors: extendErrors } = extendResult.value

  const { nftInserts, errors: transformNftsErrors } = transformNFTs(
    extendedNfts,
    chain,
  )

  const insertNftsResult = await insertNFTs(nftInserts)

  if (!insertNftsResult.ok) {
    return insertNftsResult
  }

  const errors = [
    ...fetchErrors,
    ...transformCollectionErrors,
    ...extendErrors,
    ...transformNftsErrors,
  ]

  const serializedErrors = errors.map((error) => error.serialize())

  return new Ok({
    status: 'success',
    errors: serializedErrors,
  })
}
