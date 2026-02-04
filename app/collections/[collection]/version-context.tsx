"use client";

import { useContextState } from "@/lib/state/use-context-state";
import type { UpdateOptions, NestedErrors, Validate } from "@/types/state.types";
import { createContext, useContext, useMemo } from "react";
import { updateVersionSchema } from "@/lib/schemas/versions/version-schema";
import { updateVersion as updateVersionQuery } from "@/lib/db/queries/versions";
import type { Version } from "@/lib/db/schema";
import type { ReturnInfo } from "@/lib/db/queries/types";

type UpdateVersionData = Partial<Version>;

type VersionContextType = {
  version: Version;
  updateVersion: (
    value: UpdateVersionData,
    options?: UpdateOptions
  ) => Promise<ReturnInfo>;
  validateVersion: Validate<UpdateVersionData>;
  getError: (path: Array<string | number>) => NestedErrors | undefined;
  getErrorMessage: (path: Array<string | number>) => string | undefined;
};

type VersionProviderProps = {
  children: React.ReactNode;
  version: Version;
};

const VersionContext = createContext<VersionContextType | null>(null);

export function VersionProvider({ children, version }: VersionProviderProps) {
  const updateFn = async (
    id: string,
    values: UpdateVersionData
  ): Promise<ReturnInfo> => {
    return updateVersionQuery(id, values);
  };

  const { state, update, validate, getError, getErrorMessage } =
    useContextState<Version, UpdateVersionData>(
      version,
      updateFn,
      updateVersionSchema
    );

  const contextValue = useMemo<VersionContextType>(() => {
    return {
      version: state,
      updateVersion: update,
      validateVersion: validate,
      getError,
      getErrorMessage,
    };
  }, [state, update, validate, getError, getErrorMessage]);

  return (
    <VersionContext.Provider value={contextValue}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
}
