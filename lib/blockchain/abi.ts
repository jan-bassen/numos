import type { Result } from '@repo/shared/types/result'
import 'server-only'
import type { Abi } from 'viem'
import { chains, type Address, type Chain } from './client'

type ABIResponse = Result<Abi>

export async function getAbi(
  chain: Chain,
  address: Address,
): Promise<ABIResponse> {
  const key = process.env.ETHERSCAN_API_KEY
  if (!key) {
    return {
      result: undefined,
      error: 'Etherscan API key not set',
    }
  }

  //TODO: Add support for proxies!!!

  const chainInfo = chains[chain]

  const res = await fetch(
    `https://${chainInfo.etherscanSubdomain}.etherscan.io/api?chainid=${chainInfo.chainId}&module=contract&action=getabi&address=${address}&apikey=${key}`,
  ).then((res) => res.json())
  console.log(res)
  if (res.status !== '1') {
    return {
      result: undefined,
      error: 'Smart contract does not exist or is not verified',
    }
  }
  try {
    return { result: JSON.parse(res.result) as Abi, error: undefined }
  } catch (e) {
    return {
      result: undefined,
      error: 'Error verifying contract',
    }
  }
}
