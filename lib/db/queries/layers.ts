"use server";

import { eq, and, desc, asc, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { layers, collections } from "@/lib/db/schema";
import { FetchError } from "@/lib/errors";
import { getCollectionFromSlug } from "./collections";
import type { Layer, NewLayer } from "@/lib/db/schema";
import type { LayerType } from "@/lib/schemas/layers/layer-schema";
import type { ReturnInfo } from "./types";

export type LayerNavItem = {
  slug: string;
  name: string | null;
  type: LayerType | null;
};

export type LayerOrderChange = { id: string; index: number }[];

// Read operations
export async function getAllLayers(version: string): Promise<Layer[]> {
  if (!version) {
    throw new FetchError("No collection defined");
  }

  return db.query.layers.findMany({
    where: eq(layers.version, version),
    orderBy: [asc(layers.index)],
  });
}

export async function getLatestLayers(
  version: string,
  amount = 3
): Promise<Layer[]> {
  if (!version) {
    throw new FetchError("No collection defined");
  }

  return db.query.layers.findMany({
    where: eq(layers.version, version),
    orderBy: [desc(layers.updatedAt)],
    limit: amount,
  });
}

export async function getLayerBySlugs(
  collectionSlug: string,
  layerSlug: string
): Promise<Layer | null> {
  const collection = await getCollectionFromSlug(collectionSlug);
  if (!collection.editableVersion) {
    return null;
  }

  const result = await db.query.layers.findFirst({
    where: and(
      eq(layers.slug, layerSlug),
      eq(layers.version, collection.editableVersion)
    ),
  });

  return result ?? null;
}

export async function getLayersForNav(
  collectionSlug: string
): Promise<LayerNavItem[]> {
  if (!collectionSlug) {
    throw new FetchError("No collection defined");
  }

  const collection = await getCollectionFromSlug(collectionSlug);
  if (!collection.editableVersion) {
    throw new FetchError("No editable version found");
  }

  const results = await db.query.layers.findMany({
    where: eq(layers.version, collection.editableVersion),
    columns: {
      name: true,
      slug: true,
      definition: true,
    },
    orderBy: [desc(layers.index)],
  });

  return results.map((layer) => ({
    slug: layer.slug,
    name: layer.name,
    type: layer.definition?.type ?? null,
  }));
}

export async function getNextLayerIndex(version: string): Promise<number> {
  const result = await db
    .select({ maxIndex: max(layers.index) })
    .from(layers)
    .where(eq(layers.version, version));

  const maxIndex = result[0]?.maxIndex ?? -1;
  return maxIndex + 1;
}

// Write operations
export async function insertLayer(layer: NewLayer): Promise<ReturnInfo> {
  try {
    await db.insert(layers).values(layer);
    revalidatePath("/collections/[collection]/layers");
    return { ok: true, message: "Layer created" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function insertLayerAtTop(
  layer: Omit<NewLayer, "index">
): Promise<ReturnInfo> {
  const nextIndex = await getNextLayerIndex(layer.version);
  return insertLayer({ ...layer, index: nextIndex });
}

export async function updateLayer(
  id: string,
  values: Partial<Layer>
): Promise<ReturnInfo> {
  try {
    await db.update(layers).set(values).where(eq(layers.id, id));
    revalidatePath("/collections/[collection]/layers/[layer]");
    return { ok: true, message: "Layer updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Alias for contexts that call updateLayer by id
export async function editLayer(
  values: Partial<Layer> & { id: string }
): Promise<ReturnInfo> {
  const { id, ...rest } = values;
  return updateLayer(id, rest);
}

export async function updateLayerOrder(
  layerUpdates: { id: string; index: number }[]
): Promise<ReturnInfo> {
  try {
    await Promise.all(
      layerUpdates.map(({ id, index }) =>
        db.update(layers).set({ index }).where(eq(layers.id, id))
      )
    );

    revalidatePath("/collections/[collection]/layers");
    return { ok: true, message: "Layer order updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete operations
export async function deleteLayer(
  id: string,
  options?: { redirect?: string }
): Promise<ReturnInfo> {
  try {
    await db.delete(layers).where(eq(layers.id, id));
    revalidatePath("/collections/[collection]/layers");

    if (options?.redirect) {
      redirect(options.redirect);
    }

    return { ok: true, message: "Layer deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteLayerBySlug(
  versionId: string,
  layerSlug: string
): Promise<ReturnInfo> {
  try {
    await db
      .delete(layers)
      .where(and(eq(layers.slug, layerSlug), eq(layers.version, versionId)));

    revalidatePath("/collections/[collection]/layers");
    return { ok: true, message: "Successfully deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
