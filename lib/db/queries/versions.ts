"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { versions } from "@/lib/db/schema";
import type { Version } from "@/lib/db/schema";
import type { ReturnInfo } from "./types";

// Write operations
export async function updateVersion(
  id: string,
  values: Partial<Version>
): Promise<ReturnInfo> {
  try {
    await db.update(versions).set(values).where(eq(versions.id, id));
    return { ok: true, message: "Version updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
