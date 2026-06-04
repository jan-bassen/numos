'use client'

import { createContext, useContext, useMemo } from 'react'
import { useContextState } from '@/lib/state/use-context-state'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import type { NestedErrors, UpdateOptions, Validate } from '@/types/state.types'
import type { Action, UpdateAction } from '@/types/database.types'
import { updateAction } from '@/lib/data/actions/update'
import { updateActionSchema } from '@/lib/schemas/actions/action-schema'

type ActionContext = {
  action: Action
  updateAction: (
    value: UpdateAction,
    options?: UpdateOptions,
  ) => Promise<ReturnInfo>
  validateAction: Validate<UpdateAction>
  getError: (path: Array<string | number>) => NestedErrors | undefined
  getErrorMessage: (path: Array<string | number>) => string | undefined
}

type ActionProviderProps = {
  children: React.ReactNode
  action: Action
}

const ActionContext = createContext<ActionContext | null>(null)

export function ActionProvider({ children, action }: ActionProviderProps) {
  const { state, update, validate, getError, getErrorMessage } =
    useContextState<Action, UpdateAction>(
      action,
      updateAction,
      updateActionSchema,
    )

  const contextValue = useMemo<ActionContext>(() => {
    return {
      action: state,
      updateAction: update,
      validateAction: validate,
      getError,
      getErrorMessage,
    }
  }, [state, update, validate, getError, getErrorMessage])

  return (
    <ActionContext.Provider value={contextValue}>
      {children}
    </ActionContext.Provider>
  )
}

export function useAction() {
  const context = useContext(ActionContext)
  if (!context) {
    throw new Error('useAction must be used within an ActionProvider')
  }
  return context
}
