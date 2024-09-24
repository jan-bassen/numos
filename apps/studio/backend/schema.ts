import { NodeMap } from "@/types/nodes.types";
import {
  pgTable,
  uuid,
  serial,
  text,
  varchar,
  date,
  timestamp,
  jsonb,
  bigint,
  pgEnum,
  smallint,
  boolean,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  deployed_at: timestamp("deployed_at").defaultNow(),
  address: varchar("address", { length: 64 }).notNull(),
  major: serial("major").notNull(),
  minor: serial("minor").notNull(),
  patch: serial("patch").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 42 }).notNull(),
  description: text("description"),
  image: text("image"),
  max_supply: serial("max_supply"),
  image_graph: jsonb("image_graph").$type<NodeMap>(),
});

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  index: smallint("index").notNull(),
  collection: serial("collection")
    .notNull()
    .references(() => collections.id),
  minted_at: timestamp("minted_at").defaultNow(),
  image: text("image"),
  animation_url: text("animation_url"),
  external_url: text("external_url"),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  background_color: varchar("background_color", { length: 6 }),
});

export const actions = pgTable("actions", {
  id: serial("id").primaryKey(),
  collection: serial("collection")
    .references(() => collections.id)
    .notNull(),
  action_graph: jsonb("action_graph").$type<NodeMap>(),
});

export const parameters = pgTable("parameters", {
  id: serial("id").primaryKey(),
  action: serial("action")
    .notNull()
    .references(() => actions.id),
  key: varchar("key", { length: 64 }).notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  value: text("value").notNull(),
});

export const dataType = pgEnum("data_type", [
  "string",
  "integer",
  "float",
  "boolean",
  "date",
  "address",
]);

export const attributeValueRequirement = pgEnum("attribute_value", [
  "required",
  "default",
  "optional",
]);

export const attributeScope = pgEnum("attribute_scope", [
  "collection",
  "token",
]);
export const attributeVisibility = pgEnum("attribute_visibility", [
  "public",
  "hidden",
  "private",
]);

const attributeBase = {
  id: serial("id").primaryKey(),
  token: serial("token")
    .notNull()
    .references(() => tokens.id),
  key: varchar("key", { length: 64 }).notNull(),
  scope: attributeScope("scope").default("token"),
  visibility: attributeVisibility("visibility").default("public"),
  requirement: attributeValueRequirement("requirement").notNull(),
};

const parameterBase = {
  id: serial("id").primaryKey(),
  action: serial("action")
    .notNull()
    .references(() => actions.id),
  key: varchar("key", { length: 64 }).notNull(),
  type: dataType("type").notNull(),
};

export const integerSettings = {
  ...attributeBase,
  min: bigint("min", { mode: "bigint" }),
  max: bigint("max", { mode: "bigint" }),
  default: bigint("default", { mode: "bigint" }),
};

export const floatSettings = {
  decimal_place: smallint("decimal_place").notNull(),
  min: bigint("min", { mode: "bigint" }),
  max: bigint("max", { mode: "bigint" }),
  default: bigint("default", { mode: "bigint" }),
};

export const stringSettings = {
  options: varchar("options", { length: 64 }).array(),
  default: varchar("default", { length: 64 }),
};

export const booleanSettings = {
  default: boolean("default"),
};

export const integerAttributeStates = pgTable("integer_attribute_states", {
  id: serial("id").primaryKey(),
  attribute: serial("attribute")
    .references(() => integerAttributes.id)
    .notNull(),
  token: serial("token"),
  value: bigint("value", { mode: "bigint" }).notNull(),
});

export const floatAttributeStates = pgTable("float_attribute_states", {
  id: serial("id").primaryKey(),
  attribute: serial("attribute")
    .references(() => floatAttributes.id)
    .notNull(),
  token: serial("token"),
  value: bigint("value", { mode: "bigint" }).notNull(),
});

export const stringAttributeStates = pgTable("string_attribute_states", {
  id: serial("id").primaryKey(),
  attribute: serial("attribute")
    .references(() => stringAttributes.id)
    .notNull(),
  token: serial("token"),
  value: varchar("value", { length: 64 }).notNull(),
});

export const booleanAttributeStates = pgTable("boolean_attribute_states", {
  id: serial("id").primaryKey(),
  attribute: serial("attribute")
    .references(() => booleanAttributes.id)
    .notNull(),
  token: serial("token"),
  value: boolean("value"),
});

export const integerAttributes = pgTable("integer_attributes", {
  ...attributeBase,
  ...integerSettings,
});

export const floatAttributes = pgTable("float_attributes", {
  ...attributeBase,
  ...floatSettings,
});

export const stringAttributes = pgTable("string_attributes", {
  ...attributeBase,
  ...stringSettings,
});

export const booleanAttributes = pgTable("boolean_attributes", {
  ...attributeBase,
  ...booleanSettings,
});

export const integerParameters = pgTable("integer_parameters", {
  ...parameterBase,
  ...integerSettings,
});

export const floatParameters = pgTable("float_parameters", {
  ...parameterBase,
  ...floatSettings,
});

export const stringParameters = pgTable("string_parameters", {
  ...parameterBase,
  ...stringSettings,
});

export const booleanParameters = pgTable("boolean_parameters", {
  ...parameterBase,
  ...booleanSettings,
});
