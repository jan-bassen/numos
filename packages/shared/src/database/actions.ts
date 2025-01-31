import { z } from 'zod'
import { deployments } from './deployments'
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const actionTypes = pgEnum('actionType', ['custom'])
export const actionConfigSchema = z.object({})

export const actions = pgTable(
  'actions',
  {
    id: serial('id').primaryKey(),
    deployment: serial('deployment')
      .notNull()
      .references(() => deployments.id),
    studio_id: uuid('studio_id').notNull(),
    key: varchar('slug').notNull(),
    effect: jsonb('effect').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    name: text('name'),
    description: text('description'),
  },
  (table) => ({
    key: index('action_key_idx').on(table.key),
    deployment: index('action_deployment_idx').on(table.deployment),
    studio_id: uniqueIndex('action_studio_id_idx').on(table.studio_id),
  }),
)
