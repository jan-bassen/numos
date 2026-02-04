export const chains = [
  'ethereum',
  'matic',
  'klaytn',
  'base',
  'blast',
  'arbitrum',
  'arbitrum_nova',
  'avalanche',
  'optimism',
  'solana',
  'zora',
  'sei',
  'b3',
  'bera_chain',
  'ape_chain',
  'flow',
  'sepolia',
  'amoy',
  'baobab',
  'base_sepolia',
  'blast_sepolia',
  'arbitrum_sepolia',
  'avalanche_fuji',
  'optimism_sepolia',
  'soldev',
  'zora_sepolia',
  'sei_testnet',
  'b3_sepolia',
  'flow_testnet',
] as const

export type AnyChain = (typeof chains)[number]

export const supportedChains = ['ethereum', 'ape_chain', 'base'] as const

export type Chain = (typeof supportedChains)[number]

type ChainInfo = {
  key: Chain
  name: string
  alchemyEnum: string
}

export const chainInfo: Record<Chain, ChainInfo> = {
  ethereum: {
    key: 'ethereum',
    name: 'Ethereum',
    alchemyEnum: 'eth-mainnet',
  },
  ape_chain: {
    key: 'ape_chain',
    name: 'Apechain',
    alchemyEnum: 'apechain-mainnet',
  },
  base: {
    key: 'base',
    name: 'Base',
    alchemyEnum: 'base-mainnet',
  },
} as const

export const alchemyChains = Object.values(chainInfo).map(
  (chain) => chain.alchemyEnum,
)
