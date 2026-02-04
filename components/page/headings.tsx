import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

export function H1({ children, className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1 className={cn('font-bold text-4xl', className)} {...props}>
      {children}
    </h1>
  )
}

export function H2({ children, className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2 className={cn('font-semibold text-lg', className)} {...props}>
      {children}
    </h2>
  )
}

export function H3({ children, className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3 className={cn('font-semibold text-base', className)} {...props}>
      {children}
    </h3>
  )
}
