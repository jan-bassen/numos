"use client";

import { useProfile } from "@/app/(providers)/profile-context";
import { useUser } from "@/app/(providers)/user-context";
import { Input } from "@repo/ui/components/input";
import type { InputProps } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";

export function ProfileNameInput(
  props: Omit<InputProps, "value" | "onChange">
) {
  const {
    profile: { fullName },
    updateProfile,
  } = useProfile();
  const { user } = useUser();
  
  return (
    <Input
      {...props}
      className={cn("w-full", props.className)}
      value={fullName || ""}
      placeholder={user.name || ""}
      onChange={async (event) => {
        await updateProfile(
          { fullName: event.target.value },
          { debounce: true }
        );
      }}
    />
  );
}
