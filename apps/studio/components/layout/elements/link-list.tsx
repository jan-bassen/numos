import { buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'

import type { JSX } from "react";

type LinkObject = {
  text: string
  href: string
  Icon?: JSX.Element
}

export default function LinkList({
  links,
  endLink,
  className,
}: {
  links: LinkObject[]
  endLink?: LinkObject
  className?: string
}) {
  return (
    <ul className={cn('flex w-full flex-col divide-y divide-muted', className)}>
      {links.map((link, i) => (
        <div key={link.href} className="w-full py-0.5">
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full items-center justify-start gap-2 px-3',
            )}
          >
            {link.Icon}
            {link.text}
          </Link>
        </div>
      ))}
      {endLink && (
        <div className="w-full py-0.5">
          <Link
            key="endLink"
            href={endLink.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full items-center justify-start gap-2 px-3 text-muted-foreground',
            )}
          >
            {endLink.text}
            {endLink.Icon}
          </Link>
        </div>
      )}
    </ul>
  )
}
