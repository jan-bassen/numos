import { createAuthClient } from 'better-auth/client'
import {
  usernameClient,
  anonymousClient,
  adminClient,
  multiSessionClient,
} from 'better-auth/client/plugins'

type AuthClient = ReturnType<
  typeof createAuthClient<{
    plugins: [
      ReturnType<typeof usernameClient>,
      ReturnType<typeof anonymousClient>,
      ReturnType<typeof adminClient>,
      ReturnType<typeof multiSessionClient>,
    ]
  }>
>

export const authClient: AuthClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
  plugins: [
    usernameClient(),
    anonymousClient(),
    adminClient(),
    multiSessionClient(),
  ],
})
