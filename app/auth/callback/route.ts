import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Better Auth handles OAuth callbacks automatically via the /api/auth/[...all] route
// This route is kept for backwards compatibility and redirects to home
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const next = searchParams.get("next") ?? "/";

  return NextResponse.redirect(new URL(next, request.url));
}
