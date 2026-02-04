"use server";

import { eq, and, desc, asc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { actions, collections } from "@/lib/db/schema";
import { FetchError } from "@/lib/errors";
import { getCollectionFromSlug } from "./collections";
import type { Action, NewAction } from "@/lib/db/schema";
import type { ActionTrigger } from "@/lib/schemas/actions/action-schema";
import type { TriggerType } from "@/types/database.types";

import type { ReturnInfo } from "./types";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ActionNavItem = {
  slug: string;
  name: string | null;
  type: TriggerType | null;
};

// Read operations
export async function getAllActions(version: string): Promise<Action[]> {
  if (!version) {
    throw new FetchError("No collection defined");
  }

  return db.query.actions.findMany({
    where: eq(actions.version, version),
    orderBy: [asc(actions.name)],
  });
}

export async function getLatestActions(
  version: string,
  amount = 3
): Promise<Action[]> {
  if (!version) {
    throw new FetchError("No collection defined");
  }

  return db.query.actions.findMany({
    where: eq(actions.version, version),
    orderBy: [desc(actions.updatedAt)],
    limit: amount,
  });
}

export async function getAllActionsBySlug(
  collectionSlug: string
): Promise<Action[]> {
  if (!collectionSlug) {
    throw new FetchError("No collection defined");
  }

  const collection = await getCollectionFromSlug(collectionSlug);
  if (!collection.editableVersion) {
    throw new FetchError("No editable version found");
  }

  return getAllActions(collection.editableVersion);
}

export async function getActionsForNav(
  collectionSlug: string
): Promise<ActionNavItem[]> {
  if (!collectionSlug) {
    throw new FetchError("No collection defined");
  }

  const collection = await getCollectionFromSlug(collectionSlug);
  if (!collection.editableVersion) {
    throw new FetchError("No editable version found");
  }

  const results = await db.query.actions.findMany({
    where: eq(actions.version, collection.editableVersion),
    columns: {
      name: true,
      slug: true,
      trigger: true,
    },
    orderBy: [asc(actions.name)],
  });

  return results.map((action) => ({
    slug: action.slug,
    name: action.name,
    type: (action.trigger as ActionTrigger | null)?.type ?? null,
  }));
}

export async function getActionBySlug(
  slug: string,
  version: string
): Promise<Action> {
  if (!slug) {
    throw new FetchError("No action defined");
  }

  const results = await db.query.actions.findMany({
    where: and(eq(actions.slug, slug), eq(actions.version, version)),
  });

  if (results.length > 1) {
    throw new FetchError("Multiple actions found");
  }

  const action = results[0];
  if (!action) {
    throw new FetchError("Action not found");
  }

  return action;
}

export async function getActionBySlugs(
  collectionSlug: string,
  actionSlug: string
): Promise<Action | null> {
  if (!actionSlug || !collectionSlug) {
    throw new FetchError("No action or collection defined");
  }

  const collection = await getCollectionFromSlug(collectionSlug);
  if (!collection.editableVersion) {
    return null;
  }

  const result = await db.query.actions.findFirst({
    where: and(
      eq(actions.slug, actionSlug),
      eq(actions.version, collection.editableVersion)
    ),
  });

  return result ?? null;
}

// Write operations
export async function insertAction(action: NewAction): Promise<ReturnInfo> {
  if (!action.slug) {
    return { ok: false, message: "No slug defined" };
  }

  if (action.slug === "new") {
    return { ok: false, message: "Slug cannot be 'new'" };
  }

  if (!SLUG_REGEX.test(action.slug)) {
    return {
      ok: false,
      message: "Slug can only contain lowercase letters, numbers, and dashes",
    };
  }

  // Check for duplicate slugs
  const existingSlugs = await db.query.actions.findMany({
    where: eq(actions.version, action.version),
    columns: { id: true, slug: true },
  });

  if (existingSlugs.some((a) => a.slug === action.slug && a.id !== action.id)) {
    return { ok: false, message: "Too similar name already in use" };
  }

  try {
    await db
      .insert(actions)
      .values(action)
      .onConflictDoUpdate({
        target: actions.id,
        set: action,
      });

    revalidatePath("/collections/[collection]/actions/[action]");
    return { ok: true, message: "Successfully created new action!" };
  } catch (error) {
    console.error(error);
    throw new FetchError("Error with inserting new action");
  }
}

export async function upsertBasicAction(action: NewAction): Promise<ReturnInfo> {
  return insertAction(action);
}

export async function updateActionSettings(
  id: string,
  trigger: ActionTrigger
): Promise<ReturnInfo> {
  if (!id) {
    return { ok: false, message: "No action ID provided" };
  }

  try {
    await db.update(actions).set({ trigger }).where(eq(actions.id, id));

    revalidatePath("/collections/[collection]/actions/[action]");
    return { ok: true, message: "Successfully saved" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function editAction(
  action: Partial<Action> & { id: string }
): Promise<ReturnInfo> {
  if (!action.id) {
    return { ok: false, message: "No action ID provided" };
  }

  try {
    await db.update(actions).set(action).where(eq(actions.id, action.id));

    revalidatePath("/collections/[collection]/actions/[action]", "page");
    return { ok: true, message: "Successfully updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function setActionLock(id: string, locked: boolean): Promise<void> {
  await db.update(actions).set({ locked }).where(eq(actions.id, id));
}

// Delete operations
export async function deleteAction(
  id: string,
  redirectPath?: string
): Promise<ReturnInfo> {
  if (!id) {
    throw new FetchError("No action defined");
  }

  try {
    await db.delete(actions).where(eq(actions.id, id));

    if (redirectPath) {
      redirect(redirectPath);
    }

    return { ok: true, message: "Action deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error with deleting action",
    };
  }
}

export async function deleteActionBySlug(
  versionId: string,
  actionSlug: string
): Promise<ReturnInfo> {
  try {
    await db
      .delete(actions)
      .where(and(eq(actions.slug, actionSlug), eq(actions.version, versionId)));

    revalidatePath("/collections/[collection]/actions");
    return { ok: true, message: "Successfully deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
