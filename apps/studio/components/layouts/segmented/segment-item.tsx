import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

export function SegmentItem({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn('w-full space-y-0.5 md:space-y-1.5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
