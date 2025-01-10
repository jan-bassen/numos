import { index, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { collections } from './collections'

export const deployments = pgTable(
  'deployments',
  {
    id: serial('id').primaryKey(),
    collection: serial('collection')
      .notNull()
      .references(() => collections.id),
    major: integer('major').notNull(),
    minor: integer('minor').notNull(),
    patch: integer('patch').notNull(),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    collection: index('deployment_collection_idx').on(table.collection),
  }),
)
