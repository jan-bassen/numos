import {
  pgTable,
  text,
  timestamp,
  integer,
  uniqueIndex,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { collectionsTable } from './collections'

export const chainEnum = pgEnum('chain', [
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
])

export type Chain = (typeof chainEnum.enumValues)[number]

const osContractBase = {
  address: text('address').notNull(),
  collection: integer('collection')
    .notNull()
    .references(() => collectionsTable.id),
  chain: chainEnum('chain').notNull(),
  contract_standard: text('contract_standard').notNull(),
  name: text('name').notNull(),
  total_supply: integer('total_supply').notNull(),
}

// DONT USE THIS, This is just for type inference
const DONTUSEosContractTable = pgTable('os_contracts', {
  ...osContractBase,
})

export const osContractSchema = createSelectSchema(DONTUSEosContractTable)

export type OsContract = z.infer<typeof osContractSchema>

// Use this, this is the actual table
export const contractsTable = pgTable(
  'contracts',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    ...osContractBase,
    importDate: timestamp('import_date').defaultNow(),
  },
  (t) => ({
    addressIdx: index('address_idx').on(t.address),
  }),
)

export const contractSelectSchema = createSelectSchema(contractsTable)

export type Contract = z.infer<typeof contractSelectSchema>

export const contractInsertSchema = createInsertSchema(contractsTable)

export type ContractInsert = z.infer<typeof contractInsertSchema>
