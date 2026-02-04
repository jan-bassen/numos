import {
  pgTable,
  uuid,
  timestamp,
  text,
  bigint,
  integer,
} from "drizzle-orm/pg-core";
import { imageTypeEnum } from "./enums";

// Folders table
export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  name: text("name"),
  parent: uuid("parent"),
  version: uuid("version").notNull(),
});

// Uploads table (images/assets)
export const uploads = pgTable("uploads", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  name: text("name"),
  tags: text("tags").array(),
  bytes: bigint("bytes", { mode: "number" }).notNull(),
  type: imageTypeEnum("type").notNull(),
  folder: uuid("folder"),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  version: uuid("version").notNull(),
});

// Types
export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
export type Upload = typeof uploads.$inferSelect;
export type NewUpload = typeof uploads.$inferInsert;
