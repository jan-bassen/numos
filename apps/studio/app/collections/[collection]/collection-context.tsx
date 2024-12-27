'use client'

import { useContextState } from '@/lib/state/use-context-state'
import { updateCollectionSchema } from '@/lib/schemas/collections/collection-schema'
import type { UpdateOptions } from '@/types/state.types'
import type {
  ExtendedCollection,
  ReturnInfo,
  UpdateCollection,
} from '@/types/database.types'
import { createContext, useContext, useMemo } from 'react'
import { updateCollection } from '@/lib/supabase/db/collections/update'
import type { NestedErrors, Validate } from '@/types/state.types'

type CollectionContext = {
  collection: ExtendedCollection
  updateCollection: (
    value: UpdateCollection,
    options?: UpdateOptions,
  ) => Promise<ReturnInfo>
  validateCollection: Validate<UpdateCollection>
  getError: (path: Array<string | number>) => NestedErrors | undefined
  getErrorMessage: (path: Array<string | number>) => string | undefined
}

type CollectionProviderProps = {
  children: React.ReactNode
  collection: ExtendedCollection
}
const CollectionContext = createContext<CollectionContext | null>(null)

export function CollectionProvider({
  children,
  collection,
}: CollectionProviderProps) {
  const { state, update, validate, getError, getErrorMessage } =
    useContextState<ExtendedCollection, UpdateCollection>(
      collection,
      updateCollection,
      updateCollectionSchema,
    )

  const contextValue = useMemo<CollectionContext>(() => {
    return {
      collection: state,
      updateCollection: update,
      validateCollection: validate,
      getError,
      getErrorMessage,
    }
  }, [state, update, validate, getError, getErrorMessage])

  return (
    <CollectionContext.Provider value={contextValue}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider')
  }
  return context
}
