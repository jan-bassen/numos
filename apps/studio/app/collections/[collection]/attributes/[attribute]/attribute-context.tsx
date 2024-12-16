'use client'

import { updateAttribute } from '@/lib/supabase/db/attributes/update'
import type { Attribute, UpdateAttribute } from '@/types/database.types'
import { createContext, useContext, useMemo } from 'react'
import { useContextState } from '@/lib/state/use-context-state'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import type { NestedErrors, UpdateOptions, Validate } from '@/types/state.types'
import { updateAttributeSchema } from '@/lib/schemas/attributes/attribute-schema'

type AttributeContext = {
  attribute: Attribute
  updateAttribute: (
    value: UpdateAttribute,
    options?: UpdateOptions,
  ) => Promise<ReturnInfo>
  validateAttribute: Validate<UpdateAttribute>
  getError: (path: Array<string | number>) => NestedErrors | undefined
}

type AttributeProviderProps = {
  children: React.ReactNode
  attribute: Attribute
}

const AttributeContext = createContext<AttributeContext | null>(null)

export function AttributeProvider({
  children,
  attribute,
}: AttributeProviderProps) {
  /* try {
    const res = updateAttributeSchema.parse(attribute)
    console.log(res)
  } catch (error) {
    console.error(error)
  } */

  const { state, update, validate, getError } = useContextState<
    Attribute,
    UpdateAttribute
  >(attribute, updateAttribute, updateAttributeSchema)

  const contextValue = useMemo<AttributeContext>(() => {
    return {
      attribute: state,
      updateAttribute: update,
      validateAttribute: validate,
      getError,
    }
  }, [state, update, validate, getError])

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
