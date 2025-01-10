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

export const attributes = pgTable(
  'attributes',
  {
    id: serial('id').primaryKey(),
    key: varchar('key').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    deployment: serial('deployment')
      .notNull()
      .references(() => deployments.id),
    type: attributeType('type').notNull(), //Verify
    description: text('description'),
    settings: jsonb('settings'), //Verify
  },
  (table) => ({
    key: index('attribute_key_idx').on(table.key),
    deployment: index('attribute_deployment_idx').on(table.deployment),
  }),
)
