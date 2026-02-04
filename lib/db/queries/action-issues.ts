"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { actionIssues, actions } from "@/lib/db/schema";
import type { ActionIssue, NewActionIssue } from "@/lib/db/schema";
import type { ReturnInfo } from "./types";

// Read operations
export async function getActionIssues(
  version: string
): Promise<Omit<ActionIssue, "action">[]> {
  // Get all actions for this version first
  const versionActions = await db.query.actions.findMany({
    where: eq(actions.version, version),
    columns: { id: true },
  });

  const actionIds = versionActions.map((a) => a.id);

  if (actionIds.length === 0) {
    return [];
  }

  // Get issues for these actions
  const issues = await db.query.actionIssues.findMany({
    where: (actionIssues, { inArray }) =>
      inArray(actionIssues.action, actionIds),
  });

  return issues.map((issue) => ({
    id: issue.id,
    createdAt: issue.createdAt,
    data: issue.data,
  }));
}

// Write operations
export async function insertActionIssues(
  issues: NewActionIssue[]
): Promise<ReturnInfo> {
  try {
    await db.insert(actionIssues).values(issues);
    revalidatePath("/collections/[collection]/testing");
    return { ok: true, message: "Issues inserted" };
  } catch (error) {
    return {
      ok: false,
      message: "Error with inserting issues",
    };
  }
}

// Delete operations
export async function deleteActionIssues(actionId: string): Promise<ReturnInfo> {
  try {
    await db.delete(actionIssues).where(eq(actionIssues.action, actionId));
    return { ok: true, message: "Issues deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
