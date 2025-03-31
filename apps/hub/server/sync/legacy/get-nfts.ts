'use server'

import { alchemy } from '@/server/alchemy'
import type { Chain } from '@repo/shared/constants/chains'
import { Ok } from '@repo/shared/result/ok'
import { type Result, tryCatchAsync } from '@repo/shared/result/try'
import type { OwnedNft } from 'alchemy-sdk'

export async function getNFTsOnChain(
  chain: Chain,
  ownerAddress: string,
): Promise<Result<OwnedNft[]>> {
  const res = await tryCatchAsync(async () => {
    const res = await alchemy.on(chain).nft.getNftsForOwner(ownerAddress)
    return new Ok(res)
  })
  if (!res.ok) {
    return res
  }
  const nfts = res.value.ownedNfts
  let pageKey: string | undefined = res.value.pageKey
  while (pageKey) {
    const res = await tryCatchAsync(async () => {
      return new Ok(
        await alchemy.on(chain).nft.getNftsForOwner(ownerAddress, {
          pageKey,
        }),
      )
    })
    if (!res.ok) {
      return res
    }
    nfts.push(...res.value.ownedNfts)
    pageKey = res.value.pageKey
  }
  return new Ok(nfts)
}

// Max 2 Pairs, 5 Networks each -> one wallet at a time, but up to 10 chains
/* export async function getAllNFTs(wallet: Wallet): Promise<Result<NftInsert[]>> {
  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      addresses: [
        {
          address: wallet.address,
          networks: alchemyChains,
        },
      ],
      withMetadata: true,
    }),
  }

  const res = await fetch(
    `https://api.g.alchemy.com/data/v1/${process.env.ALCHEMY_API_KEY}/assets/nfts/by-address`,
    options,
  )
  if (!res.ok) {
    console.error(res.statusText)
    return new Err('Failed to fetch NFTs', 'unknown')
  }
  const data = await res.json()
  return new Ok(data)
}
 */
