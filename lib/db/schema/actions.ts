import {
  pgTable,
  uuid,
  timestamp,
  text,
  boolean,
  jsonb,
  doublePrecision,
  bigint,
} from "drizzle-orm/pg-core";
import { datatypeEnum } from "./enums";
import type { ActionTrigger } from "@/lib/schemas/actions/action-schema";
import type {
  SavedNodeState,
  OLDSavedInputMap,
  OLDSavedOutputMap,
  OLDSavedControlMap,
} from "@repo/shared/types/graph-types";
import type { ValidationIssueData } from "@repo/shared/types/validation-types";

// Actions table (automation)
export const actions = pgTable("actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull(),
  name: text("name"),
  version: uuid("version").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  trigger: jsonb("trigger").$type<ActionTrigger>(),
  locked: boolean("locked").notNull().default(false),
});

// Action nodes table
export const actionNodes = pgTable("action_nodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  action: uuid("action").notNull(),
  type: text("type").notNull(),
  x: doublePrecision("x"),
  y: doublePrecision("y"),
  inputs: jsonb("inputs").$type<OLDSavedInputMap>(),
  outputs: jsonb("outputs").$type<OLDSavedOutputMap>(),
  controls: jsonb("controls").$type<OLDSavedControlMap>(),
  comment: text("comment"),
  state: jsonb("state").$type<SavedNodeState>(),
});

// Action connections table
export const actionConnections = pgTable("action_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: uuid("source").notNull(),
  target: uuid("target").notNull(),
  sourceOutput: text("sourceOutput").notNull(),
  targetInput: text("targetInput").notNull(),
  action: uuid("action"),
  type: datatypeEnum("type").notNull(),
});

// Action issues table
export const actionIssues = pgTable("action_issues", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  action: uuid("action").notNull(),
  data: jsonb("data").notNull().$type<ValidationIssueData>(),
});

// Types
export type Action = typeof actions.$inferSelect;
export type NewAction = typeof actions.$inferInsert;
export type ActionNode = typeof actionNodes.$inferSelect;
export type NewActionNode = typeof actionNodes.$inferInsert;
export type ActionConnection = typeof actionConnections.$inferSelect;
export type NewActionConnection = typeof actionConnections.$inferInsert;
export type ActionIssue = typeof actionIssues.$inferSelect;
export type NewActionIssue = typeof actionIssues.$inferInsert;
