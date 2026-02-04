"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { actionNodes, actionConnections } from "@/lib/db/schema";
import type { NewActionNode, NewActionConnection } from "@/lib/db/schema";
import type {
  SavedConnection,
  SavedGraph,
  SavedNode,
} from "@repo/shared/types/graph-types";
import type { ReturnInfo } from "./types";

// Read operations
export async function getActionGraph(actionId: string): Promise<SavedGraph> {
  const [nodes, connections] = await Promise.all([
    db.query.actionNodes.findMany({
      where: eq(actionNodes.action, actionId),
    }),
    db.query.actionConnections.findMany({
      where: eq(actionConnections.action, actionId),
    }),
  ]);

  return {
    nodes: nodes as unknown as SavedNode[],
    connections: connections as unknown as SavedConnection[],
  };
}

// Write operations
export async function insertActionNode(
  node: SavedNode,
  actionId: string
): Promise<ReturnInfo> {
  if (!node) {
    return {
      ok: false,
      message: "No node provided",
    };
  }

  const insertNode: NewActionNode = {
    id: node.id,
    type: node.type,
    action: actionId,
    state: node.state,
    x: node.x,
    y: node.y,
  };

  try {
    await db.insert(actionNodes).values(insertNode);
    return { ok: true, message: "Node upserted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error upserting node",
    };
  }
}

export async function updateActionNode(node: SavedNode): Promise<ReturnInfo> {
  try {
    await db
      .update(actionNodes)
      .set({ state: node.state })
      .where(eq(actionNodes.id, node.id));

    return { ok: true, message: "Node updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error updating node",
    };
  }
}

export async function saveActionNodePosition(
  nodeId: string,
  position: { x: number; y: number }
): Promise<ReturnInfo> {
  try {
    await db
      .update(actionNodes)
      .set({ x: position.x, y: position.y })
      .where(eq(actionNodes.id, nodeId));

    return { ok: true, message: "Node position saved" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error saving position",
    };
  }
}

export async function upsertActionConnection(
  connection: SavedConnection,
  actionId: string
): Promise<ReturnInfo> {
  if (!connection) {
    return {
      ok: false,
      message: "No connection provided",
    };
  }

  try {
    await db
      .insert(actionConnections)
      .values({ ...connection, action: actionId } as NewActionConnection)
      .onConflictDoUpdate({
        target: actionConnections.id,
        set: { ...connection, action: actionId } as NewActionConnection,
      });

    return { ok: true, message: "Connection upserted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error upserting connection",
    };
  }
}

// Delete operations
export async function deleteActionNode(nodeId: string): Promise<ReturnInfo> {
  try {
    await db.delete(actionNodes).where(eq(actionNodes.id, nodeId));
    return { ok: true, message: "Node deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error deleting node",
    };
  }
}

export async function deleteActionConnection(
  connectionId: string
): Promise<ReturnInfo> {
  try {
    await db
      .delete(actionConnections)
      .where(eq(actionConnections.id, connectionId));
    return { ok: true, message: "Connection deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error deleting connection",
    };
  }
}
