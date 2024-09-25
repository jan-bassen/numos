import { desc, min } from 'drizzle-orm'
import {
  index,
  integer,
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
import { z } from 'zod'

//TODO: How to track current version without recursive dependency?

//TODO: Database table for supported chains?
export const supportedChains = [11155111]

export const collections = pgTable(
  'collections',
  {
    id: serial('id').primaryKey(),
    studio_id: uuid('studio_id').notNull().unique(),
    key: varchar('slug').notNull().unique(),
    created_at: timestamp('deployed_at').defaultNow(),
    chain: integer('chain_id').notNull(),
    address: varchar('address').notNull(),
  },
  (table) => ({
    studio_id: uniqueIndex('studio_id_idx').on(table.studio_id),
    key: uniqueIndex('collection_key_idx').on(table.key),
    address: uniqueIndex('address_idx').on(table.address),
  }),
)

export const imageGraphSchema = z.object({})

export const deployments = pgTable(
  'deployments',
  {
    id: serial('id').primaryKey(),
    collection: serial('collection')
      .notNull()
      .references(() => collections.id),
    major: integer('major').notNull(),
    minor: integer('minor').notNull(),
    patch: integer('patch').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    image_graph: jsonb('image_graph').notNull(),
  },
  (table) => ({
    collection: index('deployment_collection_idx').on(table.collection),
  }),
)

export const tokenAttributesSchema = z.object({})

export const tokens = pgTable(
  'tokens',
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').defaultNow(),
    collection: serial('collection')
      .notNull()
      .references(() => collections.id),
    token_id: integer('token_id').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    attributes: jsonb('attributes').notNull(),
  },
  (table) => ({
    collection: index('token_collection_idx').on(table.collection),
    token_id: index('token_id_idx').on(table.token_id),
  }),
)

export const attributeSettingsSchema = z.object({})

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
    type: attributeType('type').notNull(),
    description: text('description'),
    settings: jsonb('settings'),
  },
  (table) => ({
    key: index('attribute_key_idx').on(table.key),
    deployment: index('attribute_deployment_idx').on(table.deployment),
  }),
)

export const actionGraphSchema = z.object({})

export const actions = pgTable(
  'actions',
  {
    id: serial('id').primaryKey(),
    key: varchar('slug').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    deployment: serial('deployment')
      .notNull()
      .references(() => deployments.id),
    graph: jsonb('graph').notNull(),
    description: text('description'),
  },
  (table) => ({
    key: index('action_key_idx').on(table.key),
    deployment: index('action_deployment_idx').on(table.deployment),
  }),
)

export const apiParametersSchema = z.object({})

export const apiTriggers = pgTable(
  'api_triggers',
  {
    id: serial('id').primaryKey(),
    key: varchar('key').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    action: serial('action')
      .notNull()
      .references(() => actions.id),
    parameters: jsonb('parameters'),
  },
  (table) => ({
    key: index('api_trigger_key_idx').on(table.key),
    actions: index('api_trigger_action_idx').on(table.action),
  }),
)

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
    schedule: varchar('schedule').notNull(),
    start_at: timestamp('start_at'),
    end_at: timestamp('end_at'),
  },
  (table) => ({
    aws_id: uniqueIndex('aws_schedule_id_idx').on(table.aws_id),
    actions: index('time_trigger_action_idx').on(table.action),
  }),
)
