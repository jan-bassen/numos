import { reverseLookup, getDomainKeySync } from '@bonfida/spl-name-service'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'

export async function snsReverseLookup(snsName: string) {
  const connection = new Connection(clusterApiUrl('mainnet-beta'))
  const domainKey = new PublicKey(snsName)
  try {
    const domainName = await reverseLookup(connection, domainKey)
    return `${domainName}.sol`
  } catch (error) {
    return null
  }
}

export async function snsLookup(snsName: string) {
  try {
    const domainName = getDomainKeySync(snsName)
    return `${domainName.pubkey.toString()}.sol`
  } catch (error) {
    return null
  }
}
