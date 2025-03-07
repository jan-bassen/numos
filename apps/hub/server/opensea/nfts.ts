'use server'

import { Chain } from 'opensea-js'
import { openseaEthAPI } from '.'
import { z } from 'zod'
import { osNftSchema } from '@/db/schema/nfts'

const osNftResponseSchema = z.object({
  nfts: z.array(osNftSchema),
  next: z.string(),
})

export type OsNFTsResponse = z.infer<typeof osNftResponseSchema>

export async function getNFTsByOwner(
  address: string,
  limit = 100,
  next?: string,
  chain: Chain = Chain.Mainnet,
): Promise<OsNFTsResponse> {
  const nfts = await openseaEthAPI.getNFTsByAccount(address, limit, next, chain)
  const response = osNftResponseSchema.safeParse(nfts)
  if (!response.success) {
    throw new Error('OpenSea API returned invalid response or changed schema')
  }

  return response.data
}
