"use client";

import { createContext, useContext, useMemo } from "react";
import { useContextState } from "@/lib/state/use-context-state";
import type { NestedErrors, UpdateOptions, Validate } from "@/types/state.types";
import type { Action } from "@/lib/db/schema";
import { editAction } from "@/lib/db/queries/actions";
import { updateActionSchema } from "@/lib/schemas/actions/action-schema";
import type { ReturnInfo } from "@/lib/db/queries/types";

type UpdateActionData = Partial<Action>;

type ActionContextType = {
  action: Action;
  updateAction: (
    value: UpdateActionData,
    options?: UpdateOptions
  ) => Promise<ReturnInfo>;
  validateAction: Validate<UpdateActionData>;
  getError: (path: Array<string | number>) => NestedErrors | undefined;
  getErrorMessage: (path: Array<string | number>) => string | undefined;
};

type ActionProviderProps = {
  children: React.ReactNode;
  action: Action;
};

const ActionContext = createContext<ActionContextType | null>(null);

export function ActionProvider({ children, action }: ActionProviderProps) {
  const updateFn = async (
    id: string,
    values: UpdateActionData
  ): Promise<ReturnInfo> => {
    return editAction({ ...values, id });
  };

  const { state, update, validate, getError, getErrorMessage } =
    useContextState<Action, UpdateActionData>(
      action,
      updateFn,
      updateActionSchema
    );

  const contextValue = useMemo<ActionContextType>(() => {
    return {
      action: state,
      updateAction: update,
      validateAction: validate,
      getError,
      getErrorMessage,
    };
  }, [state, update, validate, getError, getErrorMessage]);

  return (
    <ActionContext.Provider value={contextValue}>
      {children}
    </ActionContext.Provider>
  );
}

export function useAction() {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error("useAction must be used within an ActionProvider");
  }
  return context;
}
