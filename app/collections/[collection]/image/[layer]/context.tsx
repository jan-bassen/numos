"use client";

import { createContext, useContext, useMemo } from "react";
import { useContextState } from "@/lib/state/use-context-state";
import type { NestedErrors, UpdateOptions, Validate } from "@/types/state.types";
import type { Layer } from "@/lib/db/schema";
import { editLayer } from "@/lib/db/queries/layers";
import { updateLayerSchema } from "@/lib/schemas/layers/layer-schema";
import type { ReturnInfo } from "@/lib/db/queries/types";

type UpdateLayerData = Partial<Layer>;

type LayerContextType = {
  layer: Layer;
  updateLayer: (
    value: UpdateLayerData,
    options?: UpdateOptions
  ) => Promise<ReturnInfo>;
  validateLayer: Validate<UpdateLayerData>;
  getError: (path: Array<string | number>) => NestedErrors | undefined;
  getErrorMessage: (path: Array<string | number>) => string | undefined;
};

type LayerProviderProps = {
  children: React.ReactNode;
  layer: Layer;
};

const LayerContext = createContext<LayerContextType | null>(null);

export function LayerProvider({ children, layer }: LayerProviderProps) {
  const updateFn = async (
    id: string,
    values: UpdateLayerData
  ): Promise<ReturnInfo> => {
    return editLayer({ ...values, id });
  };

  const { state, update, validate, getError, getErrorMessage } =
    useContextState<Layer, UpdateLayerData>(layer, updateFn, updateLayerSchema);

  const contextValue = useMemo<LayerContextType>(() => {
    return {
      layer: state,
      updateLayer: update,
      validateLayer: validate,
      getError,
      getErrorMessage,
    };
  }, [state, update, validate, getError, getErrorMessage]);

  return (
    <LayerContext.Provider value={contextValue}>
      {children}
    </LayerContext.Provider>
  );
}

export function useLayer() {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error("useLayer must be used within an LayerProvider");
  }
  return context;
}
