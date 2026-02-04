import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from './lib/supabase/clients/middleware-client'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // TODO: Maybe improve security, but should be fine for now with RLS
  // If Supabase env vars are missing, don't hard-crash the app.
  try {
    const supabase = await createSupabaseMiddlewareClient(request, response)
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    // no-op: allow request through (useful for local/dev without env)
  }

  return response
}

/* export const config = {
  matcher: [
    "/((?!.*\\..*|_next|login|signup|auth|beta|error).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}; */

export const config = {
  matcher: ['/((?!.*\\..*|_next|login|signup|auth).*)', '/', '/(api|trpc)(.*)'],
}
