import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Better Auth handles email verification automatically
// This route is kept for backwards compatibility
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const next = searchParams.get("next") ?? "/";

  return NextResponse.redirect(new URL(next, request.url));
}
