import osCollectionSchema from '@/server/opensea/os-collection-schema'
import {
  pgTable,
  text,
  jsonb,
  integer,
  timestamp,
  uniqueIndex,
  pgEnum,
  unique,
  index,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { chains } from '@repo/shared/constants/chains'
import { nfts } from './nfts'
import { relations } from 'drizzle-orm'

export const spamReasonEnum = z.enum([
  'Erc721TooManyOwners',
  'Erc721TooManyTokens',
  'Erc721DishonestTotalSupply',
  'MostlyHoneyPotOwners',
  'OwnedByMostHoneyPots',
  'LowDistinctOwnersPercent',
  'HighHoneyPotOwnerPercent',
  'HighHoneyPotPercent',
  'HoneyPotsOwnMultipleTokens',
  'NoSalesActivity',
  'HighAirdropPercent',
  'Unknown',
])

export type SpamReason = z.infer<typeof spamReasonEnum>

export const spamSchema = z.object({
  spam: z.boolean(),
  spamReason: z.array(spamReasonEnum).nullable(),
})

export type Spam = z.infer<typeof spamSchema>
export const chainEnum = pgEnum('chain', chains)

export const collections = pgTable(
  'collections',
  {
    // Internal
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),

    // Base (Alchemy)
    chain: chainEnum('chain').notNull(),
    address: text('address').notNull(),
    name: text('name'),
    symbol: text('symbol'),
    spam: jsonb('spam').$type<Spam>(),

    // Opensea
    slug: text('slug'),
    imageUrl: text('image_url'),
    externalUrl: text('external_url'),
    bannerImageUrl: text('banner_image_url'),
    totalSupply: integer('total_supply'),
    // Analysis
  },
  (t) => [
    index('collection_address_idx').on(t.address),
    unique('unique_address_on_chain').on(t.address, t.chain),
  ],
)

export const collectionsRelations = relations(collections, ({ many }) => ({
  nfts: many(nfts),
}))

export const collectionSelectSchema = createSelectSchema(collections, {
  spam: spamSchema.nullable(),
})

export type Collection = z.infer<typeof collectionSelectSchema>

export const collectionInsertSchema = createInsertSchema(collections, {
  spam: spamSchema.optional(),
})

export type CollectionInsert = z.infer<typeof collectionInsertSchema>
