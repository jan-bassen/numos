import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

const actionInvocationStatus = pgEnum('action_invocation_status', [
  'pending',
  'success',
  'failed',
])

export const actionInvocations = pgTable(
  'action_invocations',
  {
    id: serial('id').primaryKey(),
    action_id: varchar('action_id', { length: 255 }),
    token_id: varchar('token_id', { length: 255 }),
    added_at: timestamp('added_at'),
    invoked_at: timestamp('invoked_at').defaultNow(),
    status: actionInvocationStatus('status'),
    invocation_data: jsonb('invocation_data'), //TODO: Add schema / optimize
    result_data: jsonb('result_data'), //TODO: Add schema / optimize
  },
  (table) => ({
    action_id_idx: index('action_id_idx').on(table.action_id),
    token_id_idx: index('token_id_idx').on(table.token_id),
    status_idx: index('status_idx').on(table.status),
  }),
)
