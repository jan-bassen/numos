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
import { deployments } from './deployments'

//TODO: Check which attribute types schould be supported
export const attributeType = pgEnum('attributeType', [
  'string',
  'number',
  'boolean',
  'enum',
  'datetime',
  'location',
  'address',
  'color',
])

export const attributeDisplayType = pgEnum('attributeDisplayType', [
  'public',
  'private',
  'hidden',
])

export const attributes = pgTable(
  'attributes',
  {
    id: serial('id').primaryKey(),
    deployment: serial('deployment')
      .notNull()
      .references(() => deployments.id),
    studio_id: uuid('studio_id').notNull(),
    key: varchar('key').notNull(),
    created_at: timestamp('created_at').defaultNow(),

    name: text('name'),
    display: attributeDisplayType('display').notNull(),
    description: text('description'),
    value: jsonb('value'), //Verify
  },
  (table) => ({
    key: index('attribute_key_idx').on(table.key),
    deployment: index('attribute_deployment_idx').on(table.deployment),
    studio_id: uniqueIndex('attribute_studio_id_idx').on(table.studio_id),
  }),
)
