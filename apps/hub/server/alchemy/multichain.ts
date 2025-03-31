import type { Chain } from '@repo/shared/constants/chains'
import { Alchemy, Network, type AlchemySettings } from 'alchemy-sdk'

export type AlchemyConfig = {
  default: AlchemySettings
  chains: Record<Chain, AlchemySettings>
}

export class AlchemyMultichainClient {
  readonly config: AlchemyConfig
  /**
   * Lazy-loaded mapping of `Network` enum to `Alchemy` instance.
   *
   * @private
   */
  private readonly instances: Map<Network, Alchemy> = new Map()

  /**
   * @param settings The settings to use for all networks.
   * @param overrides Optional settings to use for specific networks.
   */
  constructor(config: AlchemyConfig) {
    this.config = config
  }

  /**
   * Returns an instance of `Alchemy` for the given `Network`.
   *
   * @param chain
   */
  on(chain: Chain): Alchemy {
    return this.loadInstance(chain)
  }

  /**
   * Checks if an instance of `Alchemy` exists for the given `Network`. If not,
   * it creates one and stores it in the `instances` map.
   *
   * @private
   * @param network
   */
  private loadInstance(chain: Chain): Alchemy {
    const network =
      this.config.chains[chain].network ||
      this.config.default.network ||
      Network.ETH_MAINNET
    if (!this.instances.has(network)) {
      const alchemySettings = this.config.chains[chain]
      this.instances.set(network, new Alchemy(alchemySettings))
    }
    const instance = this.instances.get(network)
    if (!instance) {
      throw new Error(`No Alchemy instance found for network ${network}`)
    }
    return instance
  }
}

/** AlchemySettings with the `network` param omitted in order to avoid confusion. */
export type AlchemyChainConfig = Omit<AlchemySettings, 'network'>
