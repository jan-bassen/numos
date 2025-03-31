import { createAuthClient } from 'better-auth/react'
import {
  usernameClient,
  anonymousClient,
  adminClient,
  multiSessionClient,
} from 'better-auth/client/plugins'

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
  plugins: [
    usernameClient(),
    anonymousClient(),
    adminClient(),
    multiSessionClient(),
  ],
})

export function useSession() {
  const { data } = authClient.useSession()
  return data?.session ?? null
}

export function useUser() {
  const { data } = authClient.useSession()
  return data?.user ?? null
}

export const { signIn, signUp, signOut, resetPassword, multiSession, admin } =
  authClient
