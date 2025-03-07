import {
  pgTable,
  text,
  boolean,
  jsonb,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

const safelistStatusEnum = pgEnum('safelist_status', [
  'not_requested',
  'requested',
  'verified',
  'approved',
  'disabled_top_trending',
])

export const osCollectionBase = {
  collection: text('collection').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  bannerImageUrl: text('banner_image_url'),
  owner: text('owner').notNull(),
  safelistStatus: safelistStatusEnum('safelist_status'),
  category: text('category').notNull(),
  isDisabled: boolean('is_disabled').notNull(),
  isNsfw: boolean('is_nsfw').notNull(),
  traitOffersEnabled: boolean('trait_offers_enabled').notNull(),
  collectionOffersEnabled: boolean('collection_offers_enabled').notNull(),
  openseaUrl: text('opensea_url').notNull(),
  projectUrl: text('project_url'),
  wikiUrl: text('wiki_url'),
  discordUrl: text('discord_url'),
  telegramUrl: text('telegram_url'),
  twitterUsername: text('twitter_username'),
  instagramUsername: text('instagram_username'),
  contracts: jsonb('contracts').array(),
  editors: text('editors').array(),
  fees: jsonb('fees').array(),
  requiredZone: text('required_zone'),
  rarity: jsonb('rarity'),
  paymentTokens: jsonb('payment_tokens').array(),
  totalSupply: integer('total_supply'),
  createdDate: timestamp('created_date').notNull(),
}

const osCollectionOverrides = {
  contracts: z
    .object({
      address: z.string(),
      chain: z.string(),
    })
    .array(),
  fees: z
    .object({
      fee: z.number(),
      recipient: z.string(),
      required: z.boolean().default(false),
    })
    .array(),
  rarity: z.object({
    strategy_id: z.string(),
    strategy_version: z.string(),
    calculated_at: z.string().nullable().optional(),
    max_rank: z.number(),
    total_supply: z.number(),
  }),
  paymentTokens: z
    .object({
      symbol: z.string(),
      address: z.string(),
      chain: z.string(),
      image: z.string().url(),
      name: z.string(),
      decimals: z.number(),
      eth_price: z.number(),
      usd_price: z.number(),
    })
    .array(),
}

// DONT USE THIS, This is just for type inference
const DONTUSEosCollectionTable = pgTable('os_collections', {
  ...osCollectionBase,
})

export const osCollectionSchema = createSelectSchema(DONTUSEosCollectionTable, {
  imageUrl: (s) => s.url(),
  bannerImageUrl: (s) => s.url(),
  openseaUrl: (s) => s.url(),
  projectUrl: (s) => s.url(),
  wikiUrl: (s) => s.url(),
  discordUrl: (s) => s.url(),
  telegramUrl: (s) => s.url(),
  ...osCollectionOverrides,
})

export type OsCollection = z.infer<typeof osCollectionSchema>

// Use this, this is the actual table
export const collectionsTable = pgTable(
  'collections',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    ...osCollectionBase,
    importDate: timestamp('import_date').defaultNow(),
  },
  (t) => ({
    collectionIdx: uniqueIndex('collection_idx').on(t.collection),
  }),
)

export const collectionSelectSchema = createSelectSchema(collectionsTable, {
  imageUrl: (s) => s.url(),
  bannerImageUrl: (s) => s.url(),
  openseaUrl: (s) => s.url(),
  projectUrl: (s) => s.url(),
  wikiUrl: (s) => s.url(),
  discordUrl: (s) => s.url(),
  telegramUrl: (s) => s.url(),
  ...osCollectionOverrides,
})

export type Collection = z.infer<typeof collectionSelectSchema>

export const collectionInsertSchema = createInsertSchema(collectionsTable, {
  imageUrl: (s) => s.url(),
  bannerImageUrl: (s) => s.url(),
  openseaUrl: (s) => s.url(),
  projectUrl: (s) => s.url(),
  wikiUrl: (s) => s.url(),
  discordUrl: (s) => s.url(),
  telegramUrl: (s) => s.url(),
  ...osCollectionOverrides,
})

export type CollectionInsert = z.infer<typeof collectionInsertSchema>
