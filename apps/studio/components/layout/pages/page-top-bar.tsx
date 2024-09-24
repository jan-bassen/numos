import { cn } from "@/lib/utils";

export default function PageTopBar({
  border = true,
  children,
  className,
}: {
  border?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between px-1 pb-2 pt-1",
        border && "border-b border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
