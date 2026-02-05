import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for session cookie (Better Auth uses 'better-auth.session_token' cookie by default)
  // This is a simple check - full session validation happens in server components/API routes
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // If no session cookie and not on a public route, redirect to login
  if (!sessionCookie?.value) {
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
