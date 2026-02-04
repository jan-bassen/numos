"use client";

import { editAttribute } from "@/lib/db/queries/attributes";
import type { Attribute } from "@/lib/db/schema";
import { createContext, useContext, useMemo } from "react";
import { useContextState } from "@/lib/state/use-context-state";
import type { NestedErrors, UpdateOptions, Validate } from "@/types/state.types";
import { updateAttributeSchema } from "@/lib/schemas/attributes/attribute-schema";
import type { ReturnInfo } from "@/lib/db/queries/types";

type UpdateAttributeData = Partial<Attribute>;

type AttributeContextType = {
  attribute: Attribute;
  updateAttribute: (
    value: UpdateAttributeData,
    options?: UpdateOptions
  ) => Promise<ReturnInfo>;
  validateAttribute: Validate<UpdateAttributeData>;
  getError: (path: Array<string | number>) => NestedErrors | undefined;
  getErrorMessage: (path: Array<string | number>) => string | undefined;
};

type AttributeProviderProps = {
  children: React.ReactNode;
  attribute: Attribute;
};

const AttributeContext = createContext<AttributeContextType | null>(null);

export function AttributeProvider({
  children,
  attribute,
}: AttributeProviderProps) {
  const updateFn = async (
    id: string,
    values: UpdateAttributeData
  ): Promise<ReturnInfo> => {
    return editAttribute({ ...values, id });
  };

  const { state, update, validate, getError, getErrorMessage } =
    useContextState<Attribute, UpdateAttributeData>(
      attribute,
      updateFn,
      updateAttributeSchema
    );

  const contextValue = useMemo<AttributeContextType>(() => {
    return {
      attribute: state,
      updateAttribute: update,
      validateAttribute: validate,
      getError,
      getErrorMessage,
    };
  }, [state, update, validate, getError, getErrorMessage]);

  return (
    <AttributeContext.Provider value={contextValue}>
      {children}
    </AttributeContext.Provider>
  );
}

export function useAttribute() {
  const context = useContext(AttributeContext);
  if (!context) {
    throw new Error("useAttribute must be used within an AttributeProvider");
  }
  return context;
}
