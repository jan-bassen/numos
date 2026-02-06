"use client";

  import { cn } from "@repo/ui/lib/utils";
  import { toast } from "sonner";
  import Image from "next/image";

// TODO: Implement profile image input

export function ProfileImageInput({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("size-20", className)}>
      
    </div>
  );
}
