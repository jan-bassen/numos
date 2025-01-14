import {
  foreignKey,
  index,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { deployments } from './deployments'

export const folders = pgTable(
  'folders',
  {
    id: serial('id').primaryKey(),
    studio_id: uuid('studio_id').notNull().unique(),
    deployment: serial('deployment')
      .notNull()
      .references(() => deployments.id),
    name: varchar('name').notNull(),
    parent: serial('parent'),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => {
    return {
      deployment: index('folders_deployment_idx').on(table.deployment),
      parent: index('folders_parent_idx').on(table.parent),
      parentReference: foreignKey({
        columns: [table.parent],
        foreignColumns: [table.id],
        name: 'folders_parent_fkey',
      }),
    }
  },
)
