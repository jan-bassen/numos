import { index, pgEnum, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { actions } from '../actions'

export const tokenEventType = pgEnum('tokenEventType', [
  'mint',
  'transfer',
  'approval',
  'burn',
])

export const tokenTriggers = pgTable(
  'token_triggers',
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').defaultNow(),
    action: serial('action')
      .notNull()
      .references(() => actions.id),
    event_type: tokenEventType('event_type').notNull(),
  },
  (table) => ({
    actions: index('token_trigger_action_idx').on(table.action),
  }),
)
