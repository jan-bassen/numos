import {
  index,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { deployments } from './deployments'
import { folders } from './folders'

export const uploads = pgTable(
  'uploads',
  {
    id: serial('id').primaryKey(),
    studio_id: uuid('studio_id').notNull().unique(),
    deployment: serial('deployment')
      .notNull()
      .references(() => deployments.id),
    folder: serial('folder')
      .notNull()
      .references(() => folders.id),
    name: varchar('name').notNull(),
    type: varchar('type').notNull(),
    bytes: integer('bytes').notNull(),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    tags: varchar('tags').array().default([]),
  },
  (table) => ({
    deployment: index('uploads_deployment_idx').on(table.deployment),
    folder: index('uploads_folder_idx').on(table.folder),
    studio_id: uniqueIndex('uploads_studio_id_idx').on(table.studio_id),
  }),
)
