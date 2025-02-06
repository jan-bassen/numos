import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

export function Page({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-full max-w-7xl justify-between pt-20 pb-30 md:pt-30',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
