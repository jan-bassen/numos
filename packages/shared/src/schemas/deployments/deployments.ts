import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  text,
  pgEnum,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { collections } from '@repo/shared/schemas/database/collections'
import { z } from 'zod'
import { addressSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/address-schema'

const contractMetadata = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  banner_image: z.string().url(),
  featured_image: z.string().url(),
  external_link: z.string().url(),
  collaborators: z.array(addressSchema),
})

const deploymentStatus = pgEnum('status', ['deployed', 'failed', 'pending'])

export const deployments = pgTable(
  'deployments',
  {
    id: serial('id').primaryKey(),
    collection: serial('collection')
      .notNull()
      .references(() => collections.id),
    studio_id: uuid('studio_id').notNull(),
    major: integer('major').notNull(),
    minor: integer('minor').notNull(),
    patch: integer('patch').notNull(),
    status: deploymentStatus('status').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    contract_metadata: jsonb('contract_metadata'),
  },
  (table) => ({
    collection: index('deployment_collection_idx').on(table.collection),
    studio_id: uniqueIndex('studio_id_idx').on(table.studio_id),
  }),
)
