'use client'

import { createContext, useContext, useMemo } from 'react'
import { useContextState } from '@/lib/state/use-context-state'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import { useCollection } from '../../context'

import type {
  ContextStateConfig,
  NestedErrors,
  Validate,
  ValidateValue,
} from '@/types/state.types'
import type { Action, UpdateAction } from '@/types/database.types'
import type { ActionSchema } from '@/lib/schemas/actions/action-schema-new'

type ActionContext = {
  attribute: Action
  updateAction: (value: UpdateAction) => Promise<ReturnInfo>
  updateActionValue: <
    K extends keyof Omit<
      Action,
      'id' | 'updated_at' | 'created_at' | 'version' | 'trigger'
    >,
  >(
    key: K,
    value: Action[K],
  ) => Promise<ReturnInfo>
  validateAction: Validate<Action>
  validateActionValue: ValidateValue<Action>
  getError: (path: string) => string | undefined
}

type ActionProviderProps = {
  children: React.ReactNode
  action: Action
}

const ActionContext = createContext<ActionContext | null>(null)

export function ActionProvider({ children, action }: ActionProviderProps) {
  //TODO: Make context update function guaranteed to be typescript safe
  const { slug: collectionSlug } = useCollection()

  const config: ContextStateConfig<Action> = {
    root: {
      basePath: `/collections/${collectionSlug}/actions`,
      schemaParams: ['trigger_type'],
    },
    name: {
      debounce: 1000,
      revalidate: [
        {
          path: '/collections/[collection]/actions/[action]',
          type: 'layout',
        },
      ],
    },
    description: {
      debounce: 1000,
    },
    trigger: {
      schemaParams: ['trigger_type'],
      debounce: 500,
    },
    trigger_type: {
      isDependent: true,
    },
  }

  const { state, update, updateValue, validate, validateValue, getError } =
    useContextState<Action, ActionSchema>(
      action.id,
      action,
      updateAction,
      updateActionValue,
      actionSchema,
      config,
    )

  const contextValue = useMemo<ActionContext>(() => {
    return {
      attribute: state,
      updateAction: update,
      updateActionValue: updateValue,
      validateAction: validate,
      validateActionValue: validateValue,
      getError,
    }
  }, [state, update, updateValue, validate, validateValue, getError])

  return (
    <ActionContext.Provider value={contextValue}>
      {children}
    </ActionContext.Provider>
  )
}

export function useAttribute() {
  const context = useContext(ActionContext)
  if (!context) {
    throw new Error('No attribute context found')
  }
  return context
}
