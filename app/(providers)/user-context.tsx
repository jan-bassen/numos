'use client'

import type { User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

type UserContextType = {
  user: User
}

export const UserContext = createContext<UserContextType | null>(null)

type UserProviderProps = {
  children: React.ReactNode
  user: User
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
