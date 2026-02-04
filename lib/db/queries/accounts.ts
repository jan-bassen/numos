"use server";

import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";

export async function getFirstAccountId(): Promise<string> {
  const result = await db.query.accounts.findFirst({
    columns: { id: true },
  });

  if (!result) {
    throw new Error("Error with fetching account");
  }

  return result.id;
}
