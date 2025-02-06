import {
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

//TODO: How to track current version without recursive dependency?

export const supportedChains = [11155111]

export const collections = pgTable(
  'collections',
  {
    id: serial('id').primaryKey(),
    studio_id: uuid('studio_id').notNull().unique(),
    key: varchar('slug').notNull().unique(),
    created_at: timestamp('deployed_at').defaultNow(),
    chain: integer('chain_id').notNull(), //Verify
    address: varchar('address').notNull(), //Verify
  },
  (table) => ({
    studio_id: uniqueIndex('studio_id_idx').on(table.studio_id),
    key: uniqueIndex('collection_key_idx').on(table.key),
    address: uniqueIndex('address_idx').on(table.address),
  }),
)

export type DeployedCollection = typeof collections.$inferSelect
