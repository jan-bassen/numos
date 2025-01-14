'use client'

import { createContext, useContext, useMemo } from 'react'
import { useContextState } from '@/lib/state/use-context-state'
import type { ReturnInfo } from '@repo/ui/lib/utils'
import type { NestedErrors, UpdateOptions, Validate } from '@/types/state.types'
import type { Layer, UpdateLayer } from '@/types/database.types'
import { updateLayer } from '@/lib/supabase/db/layers/update'
import { updateLayerSchema } from '@/lib/schemas/layers/layer-schema'

type LayerContext = {
  layer: Layer
  updateLayer: (
    value: UpdateLayer,
    options?: UpdateOptions,
  ) => Promise<ReturnInfo>
  validateLayer: Validate<UpdateLayer>
  getError: (path: Array<string | number>) => NestedErrors | undefined
  getErrorMessage: (path: Array<string | number>) => string | undefined
}

type LayerProviderProps = {
  children: React.ReactNode
  layer: Layer
}

const LayerContext = createContext<LayerContext | null>(null)

export function LayerProvider({ children, layer }: LayerProviderProps) {
  const { state, update, validate, getError, getErrorMessage } =
    useContextState<Layer, UpdateLayer>(layer, updateLayer, updateLayerSchema)

  const contextValue = useMemo<LayerContext>(() => {
    return {
      layer: state,
      updateLayer: update,
      validateLayer: validate,
      getError,
      getErrorMessage,
    }
  }, [state, update, validate, getError, getErrorMessage])

  return (
    <LayerContext.Provider value={contextValue}>
      {children}
    </LayerContext.Provider>
  )
}

export function useLayer() {
  const context = useContext(LayerContext)
  if (!context) {
    throw new Error('useLayer must be used within an LayerProvider')
  }
  return context
}
