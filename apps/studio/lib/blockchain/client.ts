import { createWalletClient, createPublicClient, custom, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import 'viem/window'

export async function getWalletClient() {
  // Check for window.ethereum
  // window.ethereum is an object provided by MetaMask or other web3 wallets
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let transport
  if (window.ethereum) {
    // If window.ethereum exists, create a custom transport using it
    transport = custom(window.ethereum)
  } else {
    // If window.ethereum is not available, throw an error
    const errorMessage =
      'MetaMask or another web3 wallet is not installed. Please install one to proceed.'
    throw new Error(errorMessage)
  }

  // Declare a Wallet Client
  // This creates a wallet client using the Sepolia chain and the custom transport
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: transport,
  })

  // Return the wallet client
  return walletClient
}

export type Chain = 'mainnet' | 'sepolia'
export type Address = `0x${string}`
type BlockchainInfo = {
  chainId: number
  name: string
  etherscanSubdomain: string
}

export const chains: Record<Chain, BlockchainInfo> = {
  mainnet: { chainId: 1, name: 'mainnet', etherscanSubdomain: 'api' },
  sepolia: {
    chainId: 11155111,
    name: 'sepolia',
    etherscanSubdomain: 'api-sepolia',
  },
}

export function getBlockchainClient(chain: Chain) {
  const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_PROJECT_ID
  if (!alchemyId) {
    throw new Error('Alchemy ID not set')
  }
  if (chain === 'mainnet') {
    return createPublicClient({
      chain: mainnet,
      transport: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`),
    })
  }
  if (chain === 'sepolia') {
    return createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyId}`),
    })
  }
  throw new Error('Invalid chain')
}
