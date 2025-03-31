import {
  type AlchemyConfig,
  AlchemyMultichainClient,
} from '@/server/alchemy/multichain'
import { Network } from 'alchemy-sdk'

export const config: AlchemyConfig = {
  default: {
    network: Network.ETH_MAINNET,
    apiKey: 'demo',
  },
  chains: {
    ethereum: {
      network: Network.ETH_MAINNET,
    },
    ape_chain: {
      network: Network.APECHAIN_MAINNET,
    },
    base: {
      network: Network.BASE_MAINNET,
    },
  },
}

export const alchemy = new AlchemyMultichainClient(config)
