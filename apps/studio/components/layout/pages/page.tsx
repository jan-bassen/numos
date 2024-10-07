import { cn } from '@repo/ui/lib/utils'
import type { ReactNode } from 'react'

export default function Page({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col bg-background md:flex-row',
        className,
      )}
    >
      {children}
    </div>
  )
}
