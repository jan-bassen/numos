'use client'

import { createContext, useContext } from 'react'

/**
 * Minimal stand-in for the former Supabase `User`. Auth is removed for the demo;
 * the studio runs as a single anonymous visitor (see `@/lib/data/demo-constants`).
 */
export type DemoUser = {
  id: string
  email: string
  user_metadata: {
    name?: string | null
    avatar_url?: string | null
  }
}

type UserContextType = {
  user: DemoUser
}

export const UserContext = createContext<UserContextType | null>(null)

type UserProviderProps = {
  children: React.ReactNode
  user: DemoUser
}

export function UserProvider({ children, user }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
