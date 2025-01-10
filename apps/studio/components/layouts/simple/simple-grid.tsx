import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

export default function SimpleGrid({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn('grid gap-2 md:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    >
      {children}
    </div>
  )
}
