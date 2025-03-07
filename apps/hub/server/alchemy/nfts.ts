'use server'

import { alchemyEthereum } from '.'

export async function getNFTsByOwner(ownerAddress: string) {
  try {
    const nfts = await alchemyEthereum.nft.getNftsForOwner(ownerAddress)
    return nfts
  } catch (error) {
    console.error(error)
    return null
  }
}
