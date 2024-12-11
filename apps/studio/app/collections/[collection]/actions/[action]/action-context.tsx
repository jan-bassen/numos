'use client'

import {
  updateAttribute,
  updateAttributeValue,
} from '@/lib/supabase/db/attributes/update'
import type { Attribute, UpdateAttribute } from '@/types/database.types'
import { createContext, useContext, useMemo } from 'react'
import { useContextState } from '@/lib/state/use-context-state'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import { useCollection } from '../../context'
import {
  attributeSchema,
  type AttributeSchema,
} from '@/lib/schemas/attribute-schema-new'
import type {
  ContextStateConfig,
  NestedErrors,
  Validate,
  ValidateValue,
} from '@/types/state.types'

type AttributeContext = {
  attribute: Attribute
  updateAttribute: (value: UpdateAttribute) => Promise<ReturnInfo>
  updateAttributeValue: <
    K extends keyof Omit<
      Attribute,
      'id' | 'updated_at' | 'created_at' | 'version' | 'type' | 'list'
    >,
  >(
    key: K,
    value: Attribute[K],
  ) => Promise<ReturnInfo>
  validateAttribute: Validate<Attribute>
  validateAttributeValue: ValidateValue<Attribute>
  getError: (path: string) => string | undefined
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
  //TODO: Make context update function guaranteed to be typescript safe
  const { slug: collectionSlug } = useCollection()

  const config: ContextStateConfig<Attribute> = {
    root: {
      basePath: `/collections/${collectionSlug}/attributes`,
      schemaParams: ['type', 'list'],
    },
    name: {
      debounce: 1000,
      revalidate: [
        {
          path: '/collections/[collection]/attributes/[attribute]',
          type: 'layout',
        },
      ],
    },
    description: {
      debounce: 1000,
    },
    settings: {
      schemaParams: ['type', 'list'],
      debounce: 500,
    },
    list: {
      isDependent: true,
    },
    type: {
      isDependent: true,
    },
  }

  const { state, update, updateValue, validate, validateValue, getError } =
    useContextState<Attribute, AttributeSchema>(
      attribute.id,
      attribute,
      updateAttribute,
      updateAttributeValue,
      attributeSchema,
      config,
    )

  const contextValue = useMemo<AttributeContext>(() => {
    return {
      attribute: state,
      updateAttribute: update,
      updateAttributeValue: updateValue,
      validateAttribute: validate,
      validateAttributeValue: validateValue,
      getError,
    }
  }, [state, update, updateValue, validate, validateValue, getError])

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
