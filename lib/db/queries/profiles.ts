"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import type { Profile, NewProfile } from "@/lib/db/schema";
import type { ReturnInfo } from "./types";

// Read operations
export async function getProfile(id: string): Promise<Profile | null> {
  const result = await db.query.profiles.findFirst({
    where: eq(profiles.id, id),
  });

  return result ?? null;
}

// Write operations
export async function createProfile(profile: NewProfile): Promise<ReturnInfo> {
  try {
    await db.insert(profiles).values(profile);
    return { ok: true, message: "Profile created" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateProfile(
  id: string,
  values: Partial<Profile>
): Promise<ReturnInfo> {
  try {
    await db.update(profiles).set(values).where(eq(profiles.id, id));
    return { ok: true, message: "Profile updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateProfileImage(
  userId: string,
  avatarUrl: string
): Promise<ReturnInfo> {
  // Note: avatarUrl is stored as uuid in the schema
  // This may need adjustment based on how Vercel Blob URLs are stored
  try {
    await db
      .update(profiles)
      .set({ avatarUrl: avatarUrl as unknown as string })
      .where(eq(profiles.id, userId));
    return { ok: true, message: "Avatar updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
