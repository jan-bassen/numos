import { z } from 'zod'
import { deployments } from './deployments'
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core'

export const directions = pgEnum('direction', [
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
  'top-left',
  'center',
]) //TODO: Combine with directions from datatypes

export const blendModes = pgEnum('blendMode', [
  'clear',
  'source',
  'over',
  'in',
  'out',
  'atop',
  'dest',
  'dest-over',
  'dest-in',
  'dest-out',
  'dest-atop',
  'xor',
  'add',
  'saturate',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'colour-dodge',
  'color-dodge',
  'colour-burn',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
])

export const layerTypes = pgEnum('layerType', ['custom'])
export const layerConfigSchema = z.object({})
export const layers = pgTable(
  'layers',
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').defaultNow(),
    deployment: serial('deployment')
      .notNull()
      .references(() => deployments.id),
    index: integer('index').notNull(),
    blend: blendModes('blend').notNull(),
    type: layerTypes('type').notNull(),
    config: jsonb('config').notNull(), //Verify -> Includes graph
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    gravity: directions('gravity').notNull(),
    top: integer('top').notNull(),
    left: integer('left').notNull(),
  },
  (table) => ({
    deployment: index('deployment_layer_idx').on(table.deployment),
  }),
)
