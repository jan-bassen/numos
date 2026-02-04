import {
  pgTable,
  uuid,
  timestamp,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { versionStatusEnum } from "./enums";

// Collections table
export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  maxSupply: integer("max_supply"),
  name: text("name"),
  image: text("image"),
  editableVersion: uuid("editable_version"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  description: text("description"),
  externalLink: text("external_link"),
  banner: text("banner"),
  symbol: text("symbol"),
  account: uuid("account"),
  settingsLocked: boolean("settings_locked").notNull().default(false),
});

// Versions table
export const versions = pgTable("versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  major: integer("major").notNull().default(0),
  minor: integer("minor").notNull().default(0),
  patch: integer("patch").notNull().default(1),
  collection: uuid("collection").notNull(),
  status: versionStatusEnum("status").notNull().default("development"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  locked: boolean("locked").notNull().default(false),
  name: text("name"),
  description: text("description"),
  externalLink: text("external_link"),
  image: uuid("image"),
  banner: uuid("banner"),
  featured: uuid("featured"),
});

// Types
export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type Version = typeof versions.$inferSelect;
export type NewVersion = typeof versions.$inferInsert;
