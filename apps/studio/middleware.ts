import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from './lib/supabase/middleware-client'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  //Maybe improve security, but should be fine for now with RLS
  const supabase = await createSupabaseMiddlewareClient(request, response)
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) {
    return NextResponse.redirect(new URL('/login', request.url))
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
  matcher: ['/studio(.*)'],
}
