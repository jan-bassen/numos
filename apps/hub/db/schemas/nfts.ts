import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  bigint,
  index,
  unique,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { wallets } from '@/db/schemas/wallets'
import { collections } from '@/db/schemas/collections'
import { imageSchema } from '@/server/alchemy/schemas'
import { relations } from 'drizzle-orm'

export type AlchemyImage = z.infer<typeof imageSchema>

export const alchemyMetadataSchema = z.object({
  tokenUri: z.string().optional(),
  metadata: z.record(z.string(), z.any()).or(z.string()).optional(),
  error: z.string().optional(),
})

export type AlchemyMetadata = z.infer<typeof alchemyMetadataSchema>

export const nfts = pgTable(
  'nfts',
  {
    // Internal
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    owner: integer('owner')
      .notNull()
      .references(() => wallets.id),
    collection: integer('collection')
      .notNull()
      .references(() => collections.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),

    // Base
    tokenId: text('token_id'),
    name: text('name'),
    description: text('description'),
    tokenUri: text('token_uri').notNull(),

    // Alchemy
    alchemyImage: jsonb('image').$type<AlchemyImage>(),
    alchemyRawMetadata: jsonb('metadata').$type<AlchemyMetadata>(),
    alchemyUpdatedAt: timestamp('alchemy_updated_at').notNull(),

    // OpenSea
    /* osImage: text('os_image'),
  osAnimation: text('os_animation'),
  osUpdatedAt: timestamp('os_updated_at'), */

    // Analysis
    /* primaryCategory: text('primary_category'),
  secondaryCategories: array(text('secondary_categories')), */
  },
  (t) => [
    index('nft_token_id_idx').on(t.tokenId),
    index('nft_owner_idx').on(t.owner),
    index('nft_collection_idx').on(t.collection),
    unique('nft_token_id_owner_idx').on(t.tokenId, t.owner, t.collection),
  ],
)

export type NFT = typeof nfts.$inferSelect

export type NftInsert = typeof nfts.$inferInsert
export const nftRelations = relations(nfts, ({ one }) => ({
  collection: one(collections, {
    fields: [nfts.collection],
    references: [collections.id],
  }),
  owner: one(wallets, {
    fields: [nfts.owner],
    references: [wallets.id],
  }),
}))

export const nftSelectSchema = createSelectSchema(nfts, {
  alchemyImage: imageSchema.nullable(),
  alchemyRawMetadata: alchemyMetadataSchema.nullable(),
})

export const nftInsertSchema = createInsertSchema(nfts, {
  alchemyImage: imageSchema.nullable(),
  alchemyRawMetadata: alchemyMetadataSchema.nullable(),
})

/* type NftInsert2 = {
    tokenId: number;
    name: string;
    description: string;
    tokenUri: string;
    cacheUpdatedAt: Date;
    cachedMetadata: { ... 3 more } | null;
    image: { ... 6 more } | null;
    osData: { ... 14 more } | null;
    owner: number;
    createdAt: Date | null | undefined;
    updatedAt: Date | null | undefined;
} */
