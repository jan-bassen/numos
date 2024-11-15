import type { ReactNode } from 'react'
import { H2 } from '../../page/headings'
import Link from 'next/link'
import { cn } from '@repo/ui/lib/utils'

export default function Section({
  children,
  title,
  link,
  className,
  containerClassName,
}: {
  children?: ReactNode
  title: string
  link?: string
  className?: string
  containerClassName?: string
}) {
  return (
    <section className={cn('space-y-2', containerClassName)}>
      {link ? (
        <Link
          href={link}
          className="pl-1 font-semibold text-lg transition-colors duration-200 ease-in-out hover:underline"
        >
          {title}
        </Link>
      ) : (
        <H2 className="pl-1">{title}</H2>
      )}
      <div className={className}>{children}</div>
    </section>
  )
}
