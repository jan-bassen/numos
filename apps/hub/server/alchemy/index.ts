import { Alchemy, Network } from 'alchemy-sdk'

const configEth = {
  apiKey: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  network: Network.ETH_MAINNET,
}
export const alchemyEthereum = new Alchemy(configEth)

const configSei = {
  apiKey: `https://sei-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  network: Network.SEI_TESTNET,
}
export const alchemySei = new Alchemy(configSei)
