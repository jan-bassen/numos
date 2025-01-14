import { jsonb } from 'drizzle-orm/pg-core'
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  text,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'
import { collections } from './collections'

export const tokenAttributesSchema = z.object({})

export const tokens = pgTable(
  'tokens',
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').defaultNow(),
    collection: serial('collection')
      .notNull()
      .references(() => collections.id),
    token_id: integer('token_id').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    attributes: jsonb('attributes').notNull(), //Verify
  },
  (table) => ({
    collection: index('token_collection_idx').on(table.collection),
    token_id: index('token_id_idx').on(table.token_id),
  }),
)

export const attributeSettingsSchema = z.object({})
