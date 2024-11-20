'use server'

import { getAbi } from './abi'
import { type Address, type Chain, getBlockchainClient } from './client'
import type { Result } from '@/types/result.types'

type isERC721Response = Result<boolean>

const ERC721_INTERFACE_ID = '0x80ac58cd'

export async function isERC721(
  chain: Chain,
  address: Address,
): Promise<isERC721Response> {
  const { result: abi, error } = await getAbi(chain, address)
  if (error || !abi) {
    return {
      result: undefined,
      error: error,
    }
  }
  try {
    const client = getBlockchainClient(chain)
    const supportsInterface = (await client.readContract({
      address,
      abi,
      functionName: 'supportsInterface',
      args: [ERC721_INTERFACE_ID],
    })) as boolean
    return { result: supportsInterface, error: undefined }
  } catch (e) {
    return {
      result: undefined,
      error: 'Error verifying contract',
    }
  }
}

export async function getBlockNumber(chain: Chain) {
  const blockNumber = await getBlockchainClient(chain).getBlockNumber()
  console.log(`Current block number: ${blockNumber}`)
}

function extractAddress(encoded: string): string {
  // Ensure the input is a valid 66-character hex string starting with '0x'
  if (!/^0x[0-9a-fA-F]{64}$/.test(encoded)) {
    throw new Error('Invalid encoded value')
  }

  // Extract the last 20 bytes (40 hexadecimal characters)
  const address = encoded.slice(-40)

  // Prefix with '0x' to form a valid Ethereum address
  return `0x${address}`
}

export async function getImplementation(chain: Chain, address: Address) {
  const client = getBlockchainClient(chain)
  const data = await client.getStorageAt({
    address,
    slot: '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
  })
  const implementation = data ? extractAddress(data) : undefined
  console.log(`Implementation: ${implementation}`)
}
