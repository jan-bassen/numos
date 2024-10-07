import { cn } from '@repo/ui/lib/utils'
import type { ReactNode } from 'react'

export default function FormBody({
  children,
  className,
}: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex w-full flex-col gap-8', className)}>
      {children}
    </div>
  )
}
