import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If no session and not on a public route, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|login|signup|auth|api/auth).*)",
    "/",
  ],
};
