"use client";

import { useContextState } from "@/lib/state/use-context-state";
import { updateProfileSchema } from "@/lib/schemas/profile/profile-schema";
import { updateProfile } from "@/lib/db/queries/profiles";
import type { Profile } from "@/lib/db/schema";
import type { ReturnInfo } from "@/lib/db/queries/types";
import type { NestedErrors, UpdateOptions, Validate } from "@/types/state.types";
import { createContext, useContext, useMemo } from "react";

type UpdateProfile = Partial<Profile>;

type ProfileContextType = {
  profile: Profile;
  updateProfile: (
    profile: UpdateProfile,
    options?: UpdateOptions
  ) => Promise<ReturnInfo>;
  validateProfile: Validate<UpdateProfile>;
  getError: (path: Array<string | number>) => NestedErrors | undefined;
  getErrorMessage: (path: Array<string | number>) => string | undefined;
};

export const ProfileContext = createContext<ProfileContextType | null>(null);

type ProfileProviderProps = {
  children: React.ReactNode;
  profile: Profile;
};

export function ProfileProvider({ children, profile }: ProfileProviderProps) {
  const profileUpdateFn = async (
    id: string,
    values: UpdateProfile
  ): Promise<ReturnInfo> => {
    return updateProfile(id, values);
  };

  const { state, update, validate, getError, getErrorMessage } =
    useContextState<Profile, UpdateProfile>(
      profile,
      profileUpdateFn,
      updateProfileSchema
    );

  const contextValue = useMemo<ProfileContextType>(() => {
    return {
      profile: state,
      updateProfile: update,
      validateProfile: validate,
      getError,
      getErrorMessage,
    };
  }, [state, update, validate, getError, getErrorMessage]);

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
