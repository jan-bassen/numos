import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

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
