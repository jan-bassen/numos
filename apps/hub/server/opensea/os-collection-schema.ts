import { z } from 'zod'

const osCollectionSchema = z.object({
  collection: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  bannerImageUrl: z.string().url().nullable().optional(),
  owner: z.string(),
  safelistStatus: z
    .enum([
      'not_requested',
      'requested',
      'verified',
      'approved',
      'disabled_top_trending',
    ])
    .nullable()
    .optional(),
  category: z.string(),
  isDisabled: z.boolean(),
  isNsfw: z.boolean(),
  traitOffersEnabled: z.boolean(),
  collectionOffersEnabled: z.boolean(),
  openseaUrl: z.string().url(),
  projectUrl: z.string().url().nullable().optional(),
  wikiUrl: z.string().url().nullable().optional(),
  discordUrl: z.string().url().nullable().optional(),
  telegramUrl: z.string().url().nullable().optional(),
  twitterUsername: z.string().nullable().optional(),
  instagramUsername: z.string().nullable().optional(),
  contracts: z
    .object({
      address: z.string(),
      chain: z.string(),
    })
    .array()
    .nullable()
    .optional(),
  editors: z.array(z.string()).nullable().optional(),
  fees: z
    .object({
      fee: z.number(),
      recipient: z.string(),
      required: z.boolean().default(false),
    })
    .array()
    .nullable()
    .optional(),
  requiredZone: z.string().nullable().optional(),
  rarity: z
    .object({
      strategy_id: z.string(),
      strategy_version: z.string(),
      calculated_at: z.string().nullable().optional(),
      max_rank: z.number(),
      total_supply: z.number(),
    })
    .nullable()
    .optional(),
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
    .array()
    .nullable()
    .optional(),
  totalSupply: z.number().nullable().optional(),
  createdDate: z.date(),
})

export default osCollectionSchema

/* export const osCollectionBase = {
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
} */
