import { ReactNode } from "react";
import { H2 } from "../pages/headings";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Segment({
  children,
  title,
  link,
  className,
  containerClassName,
}: {
  children?: ReactNode;
  title: string;
  link?: string;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {link ? (
        <Link
          href={link}
          className="pl-1 text-lg font-semibold transition-colors duration-200 ease-in-out hover:underline"
        >
          {title}
        </Link>
      ) : (
        <H2 className="pl-1">{title}</H2>
      )}
      <div className={className}>{children}</div>
    </div>
  );
}
