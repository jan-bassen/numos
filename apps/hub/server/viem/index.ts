import { createPublicClient, http, type PublicClient } from 'viem'
import { mainnet, sei as seiChain } from 'viem/chains'

export const eth: PublicClient<
  ReturnType<typeof http>,
  typeof mainnet
> = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const sei: PublicClient<
  ReturnType<typeof http>,
  typeof seiChain
> = createPublicClient({
  chain: seiChain,
  transport: http(),
})
