'use client'

import type { ExtendedCollection } from '@/types/database.types'
import { createContext, useContext } from 'react'

type CollectionProviderProps = {
  children: React.ReactNode
  collection: ExtendedCollection
}
const CollectionContext = createContext<ExtendedCollection | null>(null)

export function CollectionProvider({
  children,
  collection,
}: CollectionProviderProps) {
  return (
    <CollectionContext.Provider value={collection}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (!context) {
    throw new Error('No collection context found')
  }
  return context
}
