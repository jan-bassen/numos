import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { membershipRolesOldEnum } from "./enums";

// Accounts table
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  owner: uuid("owner"),
});

// Account memberships table
export const accountMemberships = pgTable("account_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  deactivatedAt: timestamp("deactivated_at", { withTimezone: true }),
  account: uuid("account").notNull(),
  userId: uuid("user_id").notNull(),
  role: membershipRolesOldEnum("role").notNull().default("viewer"),
});

// User profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  username: text("username"),
  fullName: text("full_name"),
  avatarUrl: uuid("avatar_url"),
});

// Types
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type AccountMembership = typeof accountMemberships.$inferSelect;
export type NewAccountMembership = typeof accountMemberships.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
