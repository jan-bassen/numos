"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { imageNodes, imageConnections } from "@/lib/db/schema";
import type { NewImageNode, NewImageConnection } from "@/lib/db/schema";
import type {
  SavedConnection,
  SavedGraph,
  SavedNode,
} from "@repo/shared/types/graph-types";
import type { ReturnInfo } from "./types";

// Read operations
export async function getImageGraph(layerId: string): Promise<SavedGraph> {
  const [nodes, connections] = await Promise.all([
    db.query.imageNodes.findMany({
      where: eq(imageNodes.layer, layerId),
    }),
    db.query.imageConnections.findMany({
      where: eq(imageConnections.layer, layerId),
    }),
  ]);

  return {
    nodes: nodes as unknown as SavedNode[],
    connections: connections as unknown as SavedConnection[],
  };
}

// Write operations
export async function insertImageNode(
  node: SavedNode,
  layerId: string
): Promise<ReturnInfo> {
  if (!node) {
    return {
      ok: false,
      message: "No node provided",
    };
  }

  const insertNode: NewImageNode = {
    id: node.id,
    type: node.type,
    layer: layerId,
    state: node.state,
    x: node.x,
    y: node.y,
  };

  try {
    await db.insert(imageNodes).values(insertNode);
    return { ok: true, message: "Node upserted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error upserting node",
    };
  }
}

export async function updateImageNode(node: SavedNode): Promise<ReturnInfo> {
  try {
    await db
      .update(imageNodes)
      .set({
        state: node.state,
        comment: node.comment,
      })
      .where(eq(imageNodes.id, node.id));

    return { ok: true, message: "Node updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error updating node",
    };
  }
}

export async function saveImageNodePosition(
  nodeId: string,
  position: { x: number; y: number }
): Promise<ReturnInfo> {
  try {
    await db
      .update(imageNodes)
      .set({ x: position.x, y: position.y })
      .where(eq(imageNodes.id, nodeId));

    return { ok: true, message: "Node position saved" };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Error saving node position",
    };
  }
}

export async function upsertImageConnection(
  connection: SavedConnection,
  layerId: string
): Promise<ReturnInfo> {
  if (!connection) {
    return {
      ok: false,
      message: "No connection provided",
    };
  }

  try {
    await db
      .insert(imageConnections)
      .values({ ...connection, layer: layerId } as NewImageConnection)
      .onConflictDoUpdate({
        target: imageConnections.id,
        set: { ...connection, layer: layerId } as NewImageConnection,
      });

    return { ok: true, message: "Connection upserted" };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Error upserting connection",
    };
  }
}

// Delete operations
export async function deleteImageNode(nodeId: string): Promise<ReturnInfo> {
  try {
    await db.delete(imageNodes).where(eq(imageNodes.id, nodeId));
    return { ok: true, message: "Node deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error deleting node",
    };
  }
}

export async function deleteImageConnection(
  connectionId: string
): Promise<ReturnInfo> {
  try {
    await db
      .delete(imageConnections)
      .where(eq(imageConnections.id, connectionId));
    return { ok: true, message: "Connection deleted" };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Error deleting connection",
    };
  }
}
