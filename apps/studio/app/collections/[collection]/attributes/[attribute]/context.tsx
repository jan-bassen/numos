'use client'

import { updateAttributeValue } from '@/lib/supabase/db/attributes/update'
import type { Attribute } from '@/types/database.types'
import { createContext, useContext, useMemo, useState } from 'react'
import { useContextState } from './use-context-function'
import type { ReturnInfo } from '@repo/ui/lib/utils'

type AttributeContext = {
  attribute: Attribute
  updateAttribute: <K extends keyof Attribute>(
    key: K,
    value: Attribute[K],
  ) => Promise<ReturnInfo>
}

type AttributeProviderProps = {
  children: React.ReactNode
  attribute: Attribute
  wait?: number
}

const AttributeContext = createContext<AttributeContext | null>(null)

export function AttributeProvider({
  children,
  attribute,
  wait,
}: AttributeProviderProps) {
  //TODO: config for different debounces and revalidation

  const { state, setValue } = useContextState<Attribute>(
    attribute.id,
    attribute,
    updateAttributeValue,
    {
      debounce: wait || 500,
    },
  )

  const contextValue = useMemo<AttributeContext>(() => {
    return {
      attribute: state,
      updateAttribute: setValue,
    }
  }, [state, setValue])

  return (
    <AttributeContext.Provider value={contextValue}>
      {children}
    </AttributeContext.Provider>
  )
}

export function useAttribute() {
  const context = useContext(AttributeContext)
  if (!context) {
    throw new Error('No attribute context found')
  }
  return context
}
