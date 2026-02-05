"use client";

import { useContextState } from "@/lib/state/use-context-state";
import { updateCollectionSchema } from "@/lib/schemas/collections/collection-schema";
import type { UpdateOptions, NestedErrors, Validate } from "@/types/state.types";
import { updateCollection as updateCollectionQuery } from "@/lib/db/queries/collections";
import type { ReturnInfo } from "@/lib/db/queries/types";
import { createContext, useContext, useMemo } from "react";

// Use a more flexible type for the collection (camelCase to match Drizzle schema)
type CollectionData = {
  id: string;
  slug: string;
  name: string | null;
  description: string | null;
  image: string | null;
  banner: string | null;
  symbol: string | null;
  maxSupply: number | null;
  externalLink: string | null;
  editableVersion: string | null;
  account: string | null;
  settingsLocked: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type UpdateCollectionData = Partial<CollectionData>;

type CollectionContextType = {
  collection: CollectionData;
  updateCollection: (
    value: UpdateCollectionData,
    options?: UpdateOptions
  ) => Promise<ReturnInfo>;
  validateCollection: Validate<UpdateCollectionData>;
  getError: (path: Array<string | number>) => NestedErrors | undefined;
  getErrorMessage: (path: Array<string | number>) => string | undefined;
};

type CollectionProviderProps = {
  children: React.ReactNode;
  collection: CollectionData;
};

const CollectionContext = createContext<CollectionContextType | null>(null);

export function CollectionProvider({
  children,
  collection,
}: CollectionProviderProps) {
  const updateFn = async (
    id: string,
    values: UpdateCollectionData
  ): Promise<ReturnInfo> => {
    return updateCollectionQuery({ ...values, id });
  };

  const { state, update, validate, getError, getErrorMessage } =
    useContextState<CollectionData, UpdateCollectionData>(
      collection,
      updateFn,
      updateCollectionSchema
    );

  const contextValue = useMemo<CollectionContextType>(() => {
    return {
      collection: state,
      updateCollection: update,
      validateCollection: validate,
      getError,
      getErrorMessage,
    };
  }, [state, update, validate, getError, getErrorMessage]);

  return (
    <CollectionContext.Provider value={contextValue}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}
