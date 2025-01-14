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
    key: varchar('slug').notNull(),
    type: actionTypes('type').notNull(),
    config: jsonb('config').notNull(), //Verify -> Includes graph
    created_at: timestamp('created_at').defaultNow(),
    description: text('description'),
  },
  (table) => ({
    key: index('action_key_idx').on(table.key),
    deployment: index('action_deployment_idx').on(table.deployment),
  }),
)
