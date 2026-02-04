import { pgEnum } from "drizzle-orm/pg-core";

// Access methods for permissions
export const accessMethodEnum = pgEnum("access-method", [
  "insert",
  "select",
  "update",
  "delete",
]);

// Account tier levels
export const accountTierEnum = pgEnum("account-tier", [
  "free",
  "artist",
  "team",
  "enterprise",
]);

// Data types for node connections
export const datatypeEnum = pgEnum("datatype", [
  "exec",
  "enum",
  "number",
  "string",
  "boolean",
  "address",
  "color",
  "datetime",
  "location",
  "weather",
]);

// Direction options
export const directionEnum = pgEnum("direction", [
  "top",
  "top-right",
  "right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "left",
  "top-left",
  "center",
]);

// Attribute display visibility
export const displayEnum = pgEnum("display", ["public", "hidden", "private"]);

// Supported image types
export const imageTypeEnum = pgEnum("image-type", [
  "jpeg",
  "jpg",
  "png",
  "gif",
  "svg+xml",
  "webp",
  "avif",
]);

// Interval units for scheduling
export const intervalUnitEnum = pgEnum("interval-unit", [
  "minutes",
  "hours",
  "days",
]);

// Membership roles (current)
export const membershipRolesEnum = pgEnum("membership-roles", [
  "admin",
  "editor",
  "viewer",
  "custom",
]);

// Legacy membership roles (includes owner)
export const membershipRolesOldEnum = pgEnum("membership-roles_old", [
  "owner",
  "admin",
  "editor",
  "viewer",
  "custom",
]);

// Required status for fields
export const requiredEnum = pgEnum("required", [
  "required",
  "default",
  "optional",
]);

// Socket types for node editor
export const socketTypeEnum = pgEnum("socketType", [
  "exec",
  "image",
  "string",
  "integer",
  "float",
  "boolean",
  "vector",
  "color",
  "date",
  "location",
]);

// Trigger types (simple)
export const triggerEnum = pgEnum("trigger", [
  "api",
  "interval",
  "token",
  "schedule",
]);

// Trigger types (extended)
export const triggerTypeEnum = pgEnum("trigger-type", [
  "api",
  "interval",
  "blockchain",
  "token",
  "schedule",
]);

// Value types for attributes
export const valueTypeEnum = pgEnum("value-type", [
  "enum",
  "number",
  "string",
  "boolean",
  "address",
  "color",
  "datetime",
  "location",
  "weather",
  "image",
]);

// Version status
export const versionStatusEnum = pgEnum("version-status", [
  "development",
  "review",
  "ready",
  "live",
]);
