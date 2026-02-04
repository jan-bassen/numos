import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { actions } from "@/lib/db/schema";
import { count } from "drizzle-orm";

// Keep-alive route to prevent database from sleeping
export async function GET() {
  try {
    const result = await db.select({ count: count() }).from(actions);
    return NextResponse.json({ ok: true, count: result[0]?.count ?? 0 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Database connection failed" },
      { status: 500 }
    );
  }
}
