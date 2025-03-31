import 'server-only'
import { auth } from '@/server/auth'
import { headers } from 'next/headers'
import type { User } from 'better-auth'
import type { Session } from 'better-auth'
export async function getUser(): Promise<User | null> {
  const res = await auth.api.getSession({
    headers: await headers(),
  })
  if (!res) {
    return null
  }
  return res.user
}

export async function getSession(): Promise<Session | null> {
  const res = await auth.api.getSession({
    headers: await headers(),
  })
  if (!res) {
    return null
  }
  return res.session
}
