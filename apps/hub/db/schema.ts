import * as auth from '@/db/schemas/auth'
import { collections, collectionsRelations } from '@/db/schemas/collections'
import { nfts, nftRelations } from '@/db/schemas/nfts'
import { wallets, walletRelations } from '@/db/schemas/wallets'
import { syncs } from '@/db/schemas/syncs'

export default {
  ...auth,
  wallets,
  walletRelations,
  collections,
  collectionsRelations,
  nfts,
  nftRelations,
  syncs,
}
