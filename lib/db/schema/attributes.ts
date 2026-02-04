import {
  pgTable,
  uuid,
  timestamp,
  text,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { displayEnum } from "./enums";
import type { FullValue } from "@repo/shared/schemas/datatypes/datatype-schema";

// Attributes table
export const attributes = pgTable("attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull(),
  name: text("name"),
  tokenSpecific: boolean("token_specific").notNull().default(true),
  version: uuid("version").notNull(),
  description: text("description"),
  display: displayEnum("display").notNull().default("public"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  locked: boolean("locked").notNull().default(false),
  value: jsonb("value").$type<FullValue>(),
});

// Types
export type Attribute = typeof attributes.$inferSelect;
export type NewAttribute = typeof attributes.$inferInsert;
