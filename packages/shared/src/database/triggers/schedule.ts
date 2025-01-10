import { z } from 'zod'
import { actions } from '../actions'
import {
  index,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

export const intervalSchema = z.object({
  interval: z.number(),
  unit: z.enum(['minutes', 'hours', 'days']),
})

export const scheduleEnum = pgEnum('scheduleType', ['interval', 'cron'])

export const scheduleTriggers = pgTable(
  'time_triggers',
  {
    id: serial('id').primaryKey(),
    aws_id: uuid('aws_id').notNull().unique(),
    created_at: timestamp('created_at').defaultNow(),
    action: serial('action')
      .notNull()
      .references(() => actions.id),
    type: scheduleEnum('type').notNull(),
    schedule: varchar('schedule').notNull(), //Verify
    start_at: timestamp('start_at'), //Verify
    end_at: timestamp('end_at'), //Verify
  },
  (table) => ({
    aws_id: uniqueIndex('aws_schedule_id_idx').on(table.aws_id),
    actions: index('time_trigger_action_idx').on(table.action),
  }),
)
