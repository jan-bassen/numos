"use client";

import { createContext, useContext } from "react";
import type { User } from "@/lib/auth";

type UserContextType = {
  user: User;
};

export const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
  user: User;
};

export function UserProvider({ children, user }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
