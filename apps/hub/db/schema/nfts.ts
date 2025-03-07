import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { wallets } from './wallets'

const osNftBase = {
  identifier: text('identifier').notNull(),
  collection: text('collection').notNull(),
  contract: text('contract').notNull(),
  token_standard: text('token_standard').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  image_url: text('image_url'),
  display_image_url: text('display_image_url'),
  display_animation_url: text('display_animation_url'),
  metadata_url: text('metadata_url'),
  opensea_url: text('opensea_url'),
  updated_at: timestamp('updated_at').notNull(),
  is_disabled: boolean('is_disabled').notNull(),
  is_nsfw: boolean('is_nsfw').notNull(),
}

// DONT USE THIS, This is just for type inference
const DONTUSEosNftTable = pgTable('os_nfts', {
  ...osNftBase,
})

export const osNftSchema = createSelectSchema(DONTUSEosNftTable, {
  image_url: (s) => s.url(),
  display_image_url: (s) => s.url(),
  display_animation_url: (s) => s.url(),
  metadata_url: (s) => s.url(),
  opensea_url: (s) => s.url(),
})

export type OsNFT = z.infer<typeof osNftSchema>

// Use this, this is the actual table
export const nftTable = pgTable('nfts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  owner: text('owner')
    .notNull()
    .references(() => wallets.id),
  ...osNftBase,
})

export const nftSelectSchema = createSelectSchema(nftTable, {
  image_url: (s) => s.url(),
  display_image_url: (s) => s.url(),
  display_animation_url: (s) => s.url(),
  metadata_url: (s) => s.url(),
  opensea_url: (s) => s.url(),
})

export type NFT = z.infer<typeof nftSelectSchema>

export const nftInsertSchema = createInsertSchema(nftTable)

export type NftInsert = z.infer<typeof nftInsertSchema>
