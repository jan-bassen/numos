import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { users } from './auth'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { chains } from '@repo/shared/constants/chains'

export const syncStatus = pgEnum('sync_status', [
  'syncing',
  'success',
  'failed',
])

/* const chainState = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('syncing'),
  }),
  z.object({
    status: z.literal('success'),
  }),
  z.object({
    status: z.literal('failed'),
    message: z.string(),
  }),
  z.object({
    status: z.literal('warning'),
    message: z.string(),
  }),
])

export type ChainState = z.infer<typeof chainState>

export const syncState = z.record(
  z.string(),
  z.record(z.enum(chains), chainState),
)

export type SyncState = z.infer<typeof syncState> */

export const syncs = pgTable('syncs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  user: text('user')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  endedAt: timestamp('ended_at'),
  status: syncStatus('status').notNull().default('syncing'),
})

export type Sync = typeof syncs.$inferSelect
export type SyncInsert = typeof syncs.$inferInsert

export const syncSelectSchema = createSelectSchema(syncs)

export const syncInsertSchema = createInsertSchema(syncs)
