import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

export default function SegmentedLayout({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'flex w-full flex-col gap-4 divide-y divide-border md:gap-8',
        className,
      )}
    >
      {children}
    </div>
  )
}
