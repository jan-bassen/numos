import { relations } from "drizzle-orm";
import { accounts, accountMemberships, profiles } from "./accounts";
import { collections, versions } from "./collections";
import { attributes } from "./attributes";
import { layers, imageNodes, imageConnections } from "./layers";
import { actions, actionNodes, actionConnections, actionIssues } from "./actions";
import { folders, uploads } from "./uploads";

// Account relations
export const accountsRelations = relations(accounts, ({ many }) => ({
  memberships: many(accountMemberships),
  collections: many(collections),
}));

export const accountMembershipsRelations = relations(
  accountMemberships,
  ({ one }) => ({
    account: one(accounts, {
      fields: [accountMemberships.account],
      references: [accounts.id],
    }),
  })
);

// Collection relations
export const collectionsRelations = relations(collections, ({ one, many }) => ({
  account: one(accounts, {
    fields: [collections.account],
    references: [accounts.id],
  }),
  editableVersion: one(versions, {
    fields: [collections.editableVersion],
    references: [versions.id],
    relationName: "editableVersion",
  }),
  versions: many(versions, { relationName: "collectionVersions" }),
}));

export const versionsRelations = relations(versions, ({ one, many }) => ({
  collection: one(collections, {
    fields: [versions.collection],
    references: [collections.id],
    relationName: "collectionVersions",
  }),
  attributes: many(attributes),
  layers: many(layers),
  actions: many(actions),
  folders: many(folders),
  uploads: many(uploads),
}));

// Attribute relations
export const attributesRelations = relations(attributes, ({ one }) => ({
  version: one(versions, {
    fields: [attributes.version],
    references: [versions.id],
  }),
}));

// Layer relations
export const layersRelations = relations(layers, ({ one, many }) => ({
  version: one(versions, {
    fields: [layers.version],
    references: [versions.id],
  }),
  nodes: many(imageNodes),
  connections: many(imageConnections),
}));

export const imageNodesRelations = relations(imageNodes, ({ one }) => ({
  layer: one(layers, {
    fields: [imageNodes.layer],
    references: [layers.id],
  }),
}));

export const imageConnectionsRelations = relations(
  imageConnections,
  ({ one }) => ({
    layer: one(layers, {
      fields: [imageConnections.layer],
      references: [layers.id],
    }),
    sourceNode: one(imageNodes, {
      fields: [imageConnections.source],
      references: [imageNodes.id],
      relationName: "sourceConnection",
    }),
    targetNode: one(imageNodes, {
      fields: [imageConnections.target],
      references: [imageNodes.id],
      relationName: "targetConnection",
    }),
  })
);

// Action relations
export const actionsRelations = relations(actions, ({ one, many }) => ({
  version: one(versions, {
    fields: [actions.version],
    references: [versions.id],
  }),
  nodes: many(actionNodes),
  connections: many(actionConnections),
  issues: many(actionIssues),
}));

export const actionNodesRelations = relations(actionNodes, ({ one }) => ({
  action: one(actions, {
    fields: [actionNodes.action],
    references: [actions.id],
  }),
}));

export const actionConnectionsRelations = relations(
  actionConnections,
  ({ one }) => ({
    action: one(actions, {
      fields: [actionConnections.action],
      references: [actions.id],
    }),
    sourceNode: one(actionNodes, {
      fields: [actionConnections.source],
      references: [actionNodes.id],
      relationName: "sourceConnection",
    }),
    targetNode: one(actionNodes, {
      fields: [actionConnections.target],
      references: [actionNodes.id],
      relationName: "targetConnection",
    }),
  })
);

export const actionIssuesRelations = relations(actionIssues, ({ one }) => ({
  action: one(actions, {
    fields: [actionIssues.action],
    references: [actions.id],
  }),
}));

// Folder relations (self-referential)
export const foldersRelations = relations(folders, ({ one, many }) => ({
  version: one(versions, {
    fields: [folders.version],
    references: [versions.id],
  }),
  parentFolder: one(folders, {
    fields: [folders.parent],
    references: [folders.id],
    relationName: "parentChild",
  }),
  subfolders: many(folders, { relationName: "parentChild" }),
  uploads: many(uploads),
}));

// Upload relations
export const uploadsRelations = relations(uploads, ({ one }) => ({
  version: one(versions, {
    fields: [uploads.version],
    references: [versions.id],
  }),
  folder: one(folders, {
    fields: [uploads.folder],
    references: [folders.id],
  }),
}));
