'use client'

import { useContextState } from '@/lib/state/use-context-state'
import type { UpdateOptions } from '@/types/state.types'
import type { ReturnInfo, UpdateVersion, Version } from '@/types/database.types'
import { createContext, useContext, useMemo } from 'react'
import type { NestedErrors, Validate } from '@/types/state.types'
import { updateVersionSchema } from '@/lib/schemas/versions/version-schema'
import { updateVersion } from '@/lib/supabase/db/versions/update'

type VersionContext = {
  version: Version
  updateVersion: (
    value: UpdateVersion,
    options?: UpdateOptions,
  ) => Promise<ReturnInfo>
  validateVersion: Validate<UpdateVersion>
  getError: (path: Array<string | number>) => NestedErrors | undefined
  getErrorMessage: (path: Array<string | number>) => string | undefined
}

type VersionProviderProps = {
  children: React.ReactNode
  version: Version
}
const VersionContext = createContext<VersionContext | null>(null)

export function VersionProvider({ children, version }: VersionProviderProps) {
  const { state, update, validate, getError, getErrorMessage } =
    useContextState<Version, UpdateVersion>(
      version,
      updateVersion,
      updateVersionSchema,
    )

  const contextValue = useMemo<VersionContext>(() => {
    return {
      version: state,
      updateVersion: update,
      validateVersion: validate,
      getError,
      getErrorMessage,
    }
  }, [state, update, validate, getError, getErrorMessage])

  return (
    <VersionContext.Provider value={contextValue}>
      {children}
    </VersionContext.Provider>
  )
}

export function useVersion() {
  const context = useContext(VersionContext)
  if (!context) {
    throw new Error('useVersion must be used within a VersionProvider')
  }
  return context
}
