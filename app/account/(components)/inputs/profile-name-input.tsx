"use client";

import { useUser } from "@/app/(providers)/user-context";
import { Input } from "@repo/ui/components/input";
import type { InputProps } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";

export function ProfileNameInput(
  props: Omit<InputProps, "value" | "onChange">
) {
  const { user } = useUser();
  
  // TODO: Implement profile name input
  return (
    <Input
      {...props}
      className={cn("w-full", props.className)}
      value={user.name || ""}
      placeholder={user.name || ""}

    />
  );
}
