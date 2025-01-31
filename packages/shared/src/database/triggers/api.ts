import { z } from 'zod'
import { actions } from '../actions'
import {
  index,
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const apiParametersSchema = z.object({})

export const apiTriggers = pgTable(
  'api_triggers',
  {
    id: serial('id').primaryKey(),
    key: varchar('key').notNull(), //Verify
    created_at: timestamp('created_at').defaultNow(),
    action: serial('action')
      .notNull()
      .references(() => actions.id),
    parameters: jsonb('parameters'), //Verify
  },
  (table) => ({
    key: index('api_trigger_key_idx').on(table.key),
    actions: index('api_trigger_action_idx').on(table.action),
  }),
)
