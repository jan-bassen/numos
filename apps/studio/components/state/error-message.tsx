import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

export default function ErrorMessage({
  error,
  className,
  ...props
}: ComponentProps<'p'> & { error?: string }) {
  if (!error) return null
  return (
    <p className={cn('text-destructive text-sm', className)} {...props}>
      {error}
    </p>
  )
}
