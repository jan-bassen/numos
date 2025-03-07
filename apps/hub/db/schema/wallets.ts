import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { chainEnum } from './contracts'

export const wallets = pgTable('wallets', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  address: text('address').notNull(),
  chain: chainEnum('chain').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})
