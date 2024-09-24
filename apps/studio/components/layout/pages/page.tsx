import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Page({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-background md:flex-row",
        className,
      )}
    >
      {children}
    </div>
  );
}
