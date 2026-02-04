import {
  pgTable,
  uuid,
  timestamp,
  text,
  boolean,
  jsonb,
  doublePrecision,
  integer,
} from "drizzle-orm/pg-core";
import { datatypeEnum } from "./enums";
import type { LayerDefinition } from "@/lib/schemas/layers/layer-schema";
import type { SavedNodeState } from "@repo/shared/types/graph-types";

// Layers table (image composition)
export const layers = pgTable("layers", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  version: uuid("version").notNull(),
  slug: text("slug").notNull(),
  definition: jsonb("definition").notNull().$type<LayerDefinition>(),
  name: text("name"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  locked: boolean("locked").notNull().default(false),
  description: text("description"),
  index: integer("index").notNull(),
});

// Image nodes table (node-based editor)
export const imageNodes = pgTable("image_nodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  x: doublePrecision("x"),
  y: doublePrecision("y"),
  comment: text("comment"),
  state: jsonb("state").$type<SavedNodeState>(),
  layer: uuid("layer").notNull(),
});

// Image connections table
export const imageConnections = pgTable("image_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: uuid("source").notNull(),
  target: uuid("target").notNull(),
  sourceOutput: text("sourceOutput").notNull(),
  targetInput: text("targetInput").notNull(),
  type: datatypeEnum("type").notNull(),
  layer: uuid("layer").notNull(),
});

// Types
export type Layer = typeof layers.$inferSelect;
export type NewLayer = typeof layers.$inferInsert;
export type ImageNode = typeof imageNodes.$inferSelect;
export type NewImageNode = typeof imageNodes.$inferInsert;
export type ImageConnection = typeof imageConnections.$inferSelect;
export type NewImageConnection = typeof imageConnections.$inferInsert;
