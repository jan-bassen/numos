import type { ReactNode } from 'react'
import { H2 } from '../../page/headings'
import Link from 'next/link'
import { cn } from '@repo/ui/lib/utils'
import Subheading from '../subheading'
import type { TooltipInfo } from '@repo/ui/components/help/info-tooltip'

export default function Section({
  children,
  title,
  link,
  className,
  containerClassName,
  info,
}: {
  children?: ReactNode
  title: string
  link?: string
  className?: string
  containerClassName?: string
  info?: Omit<TooltipInfo, 'title'>
}) {
  return (
    <section className={cn('space-y-2', containerClassName)}>
      <Subheading title={title} info={info} link={link} />
      <div className={className}>{children}</div>
    </section>
  )
}
