import type { Wallet } from '@/db/schemas/wallets'
import { alchemy } from '@/server/alchemy'
import type { Chain } from '@repo/shared/constants/chains'
import { tryCatchAsync } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'
import { Err } from '@repo/shared/result/err'
import type { OwnedNft } from 'alchemy-sdk'

/**
 * Fetches initial batch of NFTs for a list of wallets in parallel
 * @param chain The blockchain to fetch from
 * @param wallets List of wallets to check for NFTs
 * @param pageKey Optional pageKey for pagination
 * @returns Object with NFTs, errors, and continuation information
 */
async function fetchNftsBatch(
  chain: Chain,
  wallets: Wallet[],
  pageKey?: string,
) {
  const errors: Err<'walletSync'>[] = []
  const rawNfts: Array<OwnedNft & { wallet: number }> = []
  const continuations: Array<{ wallet: Wallet; pageKey: string }> = []

  // Process wallets in parallel for initial fetch
  const results = await Promise.all(
    wallets.map(async (wallet) => {
      return {
        wallet,
        result: await tryCatchAsync(async () => {
          const res = await alchemy
            .on(chain)
            .nft.getNftsForOwner(wallet.address, {
              pageKey: pageKey,
            })

          return new Ok({
            nfts: res.ownedNfts,
            pageKey: res.pageKey,
          })
        }),
      }
    }),
  )

  // Process results
  for (const { wallet, result } of results) {
    if (!result.ok) {
      errors.push(
        new Err('Failed to fetch NFTs', 'walletSync', {
          internalMessage: result.message,
          location: {
            wallet: wallet.address,
            chain,
          },
        }),
      )
      continue
    }

    // Add NFTs to collection with wallet ID
    rawNfts.push(
      ...result.value.nfts.map((nft) => ({ ...nft, wallet: wallet.id })),
    )

    // Store continuation if more pages exist
    if (result.value.pageKey) {
      continuations.push({
        wallet,
        pageKey: result.value.pageKey,
      })
    }
  }

  return { rawNfts, errors, continuations }
}

/**
 * Fetches NFTs for a given set of wallets on a specified chain,
 * optimizing for both parallel processing and complete pagination.
 *
 * @param chain The blockchain to fetch from
 * @param wallets List of wallets to check for NFTs
 * @returns Object containing all fetched NFTs and any errors that occurred
 */
export async function fetchNfts(
  chain: Chain,
  wallets: Wallet[],
): Promise<{
  rawNfts: (OwnedNft & { wallet: number })[]
  errors: Err<'walletSync'>[]
}> {
  // First batch: fetch all wallets in parallel
  const { rawNfts, errors, continuations } = await fetchNftsBatch(
    chain,
    wallets,
  )

  // Handle pagination for wallets that have more NFTs
  const paginationPromises = continuations.map(async (cont) => {
    let currentPageKey = cont.pageKey
    let hasMorePages = true
    const walletNfts: Array<OwnedNft & { wallet: number }> = []
    const walletErrors: Err<'walletSync'>[] = []

    // Continue fetching pages until no more pageKey is returned
    while (hasMorePages) {
      const result = await tryCatchAsync(async () => {
        const res = await alchemy
          .on(chain)
          .nft.getNftsForOwner(cont.wallet.address, {
            pageKey: currentPageKey,
          })

        return new Ok({
          nfts: res.ownedNfts,
          pageKey: res.pageKey,
        })
      })

      if (!result.ok) {
        walletErrors.push(
          new Err('Failed to fetch NFT page', 'walletSync', {
            internalMessage: result.message,
            location: {
              wallet: cont.wallet.address,
              chain,
            },
          }),
        )
        break
      }

      // Add NFTs to collection with wallet ID
      walletNfts.push(
        ...result.value.nfts.map((nft) => ({ ...nft, wallet: cont.wallet.id })),
      )

      // Update pagination status
      if (result.value.pageKey) {
        currentPageKey = result.value.pageKey
      } else {
        hasMorePages = false
      }
    }

    return { nfts: walletNfts, errors: walletErrors }
  })

  // Process all pagination results
  const paginationResults = await Promise.all(paginationPromises)

  // Combine all results
  const allNfts = [...rawNfts]
  const allErrors = [...errors]

  for (const result of paginationResults) {
    allNfts.push(...result.nfts)
    allErrors.push(...result.errors)
  }

  return {
    rawNfts: allNfts,
    errors: allErrors,
  }
}
