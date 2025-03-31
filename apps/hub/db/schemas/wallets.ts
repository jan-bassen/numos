import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  index,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core'
import { users } from '@/db/schemas/auth'
import { createSelectSchema } from 'drizzle-zod'
import { createInsertSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { relations } from 'drizzle-orm'
import { nfts } from './nfts'

export const addressTypeEnum = pgEnum('address_type', [
  'evm',
  'sol',
  'sei',
  'btc',
])

export const wallets = pgTable(
  'wallets',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    address: text('address').notNull(),
    humanReadable: text('human_readable'),
    shortAddress: text('short_address').notNull(),
    type: addressTypeEnum('address_type').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow(),
    lastSync: timestamp('last_sync'),
  },
  (t) => [
    index('wallet_address_idx').on(t.address),
    index('wallet_user_id_idx').on(t.userId),
    unique('wallet_address_user_id_unique').on(t.address, t.userId),
  ],
)

export const walletRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  nfts: many(nfts),
}))

export const walletSelectSchema = createSelectSchema(wallets)

export type Wallet = z.infer<typeof walletSelectSchema>

export const walletInsertSchema = createInsertSchema(wallets)

export type WalletInsert = z.infer<typeof walletInsertSchema>
