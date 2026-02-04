"use server";

import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { collections, versions } from "@/lib/db/schema";
import { FetchError } from "@/lib/errors";
import { getFirstAccountId } from "./accounts";
import type {
  Collection,
  NewCollection,
  Version,
  NewVersion,
} from "@/lib/db/schema";

import type { ReturnInfo } from "./types";

// Types
export type ExtendedCollection = Collection & {
  editableVersion: Version;
};

// Read operations
export async function isCollectionSlugTaken(slug: string): Promise<boolean> {
  const result = await db.query.collections.findFirst({
    where: eq(collections.slug, slug),
    columns: { slug: true },
  });

  return !!result;
}

export async function getCollectionFromSlug(slug: string): Promise<Collection> {
  if (!slug) {
    throw new FetchError("No slug defined");
  }

  const result = await db.query.collections.findFirst({
    where: eq(collections.slug, slug),
  });

  if (!result) {
    throw new FetchError("Error with fetching collection");
  }

  return result;
}

export async function getVersionIdFromCollectionSlug(
  slug: string
): Promise<string> {
  if (!slug) {
    throw new FetchError("No slug defined");
  }

  const result = await db.query.collections.findFirst({
    where: eq(collections.slug, slug),
    columns: { editableVersion: true },
  });

  if (!result || !result.editableVersion) {
    throw new FetchError("Error with fetching collection");
  }

  return result.editableVersion;
}

export async function getAllExtendedCollections(): Promise<
  ExtendedCollection[]
> {
  const results = await db.query.collections.findMany({
    with: { editableVersion: true },
  });

  return results.filter(
    (c): c is ExtendedCollection => c.editableVersion !== null
  );
}

export async function getAllCollections(): Promise<Collection[]> {
  return db.query.collections.findMany();
}

export async function getLatestCollections(): Promise<ExtendedCollection[]> {
  const results = await db.query.collections.findMany({
    with: { editableVersion: true },
    orderBy: [desc(collections.createdAt)],
    limit: 5,
  });

  return results.filter(
    (c): c is ExtendedCollection => c.editableVersion !== null
  );
}

export async function getExtendedCollectionFromSlug(
  collectionSlug: string
): Promise<ExtendedCollection> {
  const result = await db.query.collections.findFirst({
    where: eq(collections.slug, collectionSlug),
    with: { editableVersion: true },
  });

  if (!result) {
    throw new FetchError("Error with fetching collection");
  }

  if (!result.editableVersion) {
    notFound();
  }

  return result as ExtendedCollection;
}

export async function getVersion(id: string): Promise<Version> {
  if (!id) {
    throw new FetchError("No version defined");
  }

  const result = await db.query.versions.findFirst({
    where: eq(versions.id, id),
  });

  if (!result) {
    throw new FetchError("Error with fetching version");
  }

  return result;
}

export async function getAllVersions(collectionId: string): Promise<Version[]> {
  if (!collectionId) {
    throw new FetchError("No collection defined");
  }

  return db.query.versions.findMany({
    where: eq(versions.collection, collectionId),
  });
}

// Write operations
export async function insertCollection(
  collection: NewCollection
): Promise<ReturnInfo> {
  const accountId = await getFirstAccountId();

  try {
    await db.insert(collections).values({ ...collection, account: accountId });
    return { ok: true, message: "Successfully created" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function upsertCollection(
  collection: NewCollection,
  version?: Omit<NewVersion, "collection">
): Promise<ReturnInfo> {
  if (!collection.id && !version) {
    return {
      ok: false,
      message: "No version provided for new collection",
    };
  }

  const isTaken = await isCollectionSlugTaken(collection.slug);
  if (isTaken && !collection.id) {
    return {
      ok: false,
      message: "This identifier is already taken, please choose another",
    };
  }

  try {
    // Insert or update collection
    const [collectionData] = await db
      .insert(collections)
      .values(collection)
      .onConflictDoUpdate({
        target: collections.id,
        set: collection,
      })
      .returning();

    if (!collectionData) {
      return { ok: false, message: "Error creating collection" };
    }

    // If new collection, create version
    if (!collection.id && version) {
      const [versionData] = await db
        .insert(versions)
        .values({ ...version, collection: collectionData.id })
        .returning();

      if (!versionData) {
        return { ok: false, message: "Error creating version" };
      }

      // Update collection with editable version
      await db
        .update(collections)
        .set({ editableVersion: versionData.id })
        .where(eq(collections.id, collectionData.id));
    }

    revalidatePath("/collections/[collection]");
    return { ok: true, message: "Successfully saved" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateCollection(
  collection: Partial<Collection> & { id: string }
): Promise<ReturnInfo> {
  if (!collection.id) {
    return { ok: false, message: "No collection ID provided" };
  }

  try {
    await db
      .update(collections)
      .set(collection)
      .where(eq(collections.id, collection.id));

    revalidatePath("/collections/[collection]", "layout");
    revalidatePath("/collections/[collection]", "page");
    revalidatePath("/collections/[collection]/settings", "page");

    return { ok: true, message: "Successfully saved" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function setCollectionSettingsLock(
  id: string,
  locked: boolean
): Promise<ReturnInfo> {
  try {
    await db
      .update(collections)
      .set({ settingsLocked: locked })
      .where(eq(collections.id, id));

    return { ok: true, message: "Successfully updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateCollectionImage(
  collectionId: string,
  image: string
): Promise<ReturnInfo> {
  try {
    await db
      .update(collections)
      .set({ image })
      .where(eq(collections.id, collectionId));

    return { ok: true, message: "Collection image updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete operations
export async function deleteCollection(id: string): Promise<ReturnInfo> {
  try {
    await db.delete(collections).where(eq(collections.id, id));
    revalidatePath("/collections/[collection]");
    return { ok: true, message: "Successfully deleted" };
  } catch (error) {
    return {
      ok: false,
      message: `Couldn't delete collection: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function deleteCollectionBySlug(
  slug: string
): Promise<ReturnInfo> {
  const collection = await getCollectionFromSlug(slug);
  return deleteCollection(collection.id);
}
