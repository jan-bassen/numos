"use server";

import { eq, and, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { attributes, collections } from "@/lib/db/schema";
import { FetchError } from "@/lib/errors";
import { getCollectionFromSlug } from "./collections";
import type { Attribute, NewAttribute } from "@/lib/db/schema";
import type { ReturnInfo } from "./types";

export type AttributeNavItem = Pick<Attribute, "name" | "slug" | "value">;

// Read operations
export async function getAllAttributes(version: string): Promise<Attribute[]> {
  if (!version) {
    throw new FetchError("No collection defined");
  }

  return db.query.attributes.findMany({
    where: eq(attributes.version, version),
    orderBy: [asc(attributes.name)],
  });
}

export async function getLatestAttributes(
  version: string,
  amount = 3
): Promise<Attribute[]> {
  if (!version) {
    throw new FetchError("No collection defined");
  }

  return db.query.attributes.findMany({
    where: eq(attributes.version, version),
    orderBy: [desc(attributes.updatedAt)],
    limit: amount,
  });
}

export async function getAttribute(id: string): Promise<Attribute> {
  if (!id) {
    throw new FetchError("No attribute defined");
  }

  const result = await db.query.attributes.findFirst({
    where: eq(attributes.id, id),
  });

  if (!result) {
    throw new FetchError("Error with fetch");
  }

  return result;
}

export async function getAttributeBySlug(
  version: string,
  slug: string
): Promise<Attribute> {
  if (!slug) {
    throw new FetchError("No attribute defined");
  }

  const result = await db.query.attributes.findFirst({
    where: and(eq(attributes.slug, slug), eq(attributes.version, version)),
  });

  if (!result) {
    throw new FetchError("Attribute not found");
  }

  return result;
}

export async function getAttributeBySlugs(
  collectionSlug: string,
  attributeSlug: string
): Promise<Attribute | null> {
  if (!attributeSlug || !collectionSlug) {
    throw new FetchError("No attribute or collection defined");
  }

  const collection = await getCollectionFromSlug(collectionSlug);
  if (!collection.editableVersion) {
    return null;
  }

  const result = await db.query.attributes.findFirst({
    where: and(
      eq(attributes.slug, attributeSlug),
      eq(attributes.version, collection.editableVersion)
    ),
  });

  return result ?? null;
}

export async function getAttributesForNav(
  version: string
): Promise<AttributeNavItem[]> {
  if (!version) {
    throw new FetchError("No collection defined");
  }

  const results = await db.query.attributes.findMany({
    where: eq(attributes.version, version),
    columns: {
      name: true,
      slug: true,
      value: true,
    },
    orderBy: [asc(attributes.name)],
  });

  return results;
}

// Write operations
export async function insertAttribute(
  attribute: NewAttribute
): Promise<ReturnInfo> {
  try {
    await db.insert(attributes).values(attribute);
    revalidatePath("/collections/[collection]/attributes");
    return { ok: true, message: "Attribute created" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function duplicateAttribute(id: string): Promise<ReturnInfo> {
  const original = await getAttribute(id);

  const newAttribute: NewAttribute = {
    ...original,
    id: undefined,
    slug: `${original.slug}-copy`,
    name: `${original.name} (copy)`,
    createdAt: undefined,
    updatedAt: undefined,
  };

  return insertAttribute(newAttribute);
}

export async function updateAttribute(
  id: string,
  values: Partial<Attribute>
): Promise<ReturnInfo> {
  try {
    await db.update(attributes).set(values).where(eq(attributes.id, id));
    revalidatePath("/collections/[collection]/attributes/[attribute]");
    return { ok: true, message: "Attribute updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Alias for contexts that call updateAttribute by id
export async function editAttribute(
  values: Partial<Attribute> & { id: string }
): Promise<ReturnInfo> {
  const { id, ...rest } = values;
  return updateAttribute(id, rest);
}

// Delete operations
export async function deleteAttribute(
  attributeId: string,
  redirectPath?: string
): Promise<ReturnInfo> {
  try {
    await db.delete(attributes).where(eq(attributes.id, attributeId));
    revalidatePath("/collections/[collection]/attributes");

    if (redirectPath) {
      redirect(redirectPath);
    }

    return { ok: true, message: "Attribute deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteAttributeBySlug(
  versionId: string,
  attributeSlug: string
): Promise<ReturnInfo> {
  try {
    await db
      .delete(attributes)
      .where(
        and(
          eq(attributes.slug, attributeSlug),
          eq(attributes.version, versionId)
        )
      );

    revalidatePath("/collections/[collection]/attributes");
    return { ok: true, message: "Successfully deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
