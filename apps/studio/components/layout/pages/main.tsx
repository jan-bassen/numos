import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export default function Main({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <main
      className={cn(
        'flex min-h-screen w-full flex-col gap-4 overflow-visible bg-background p-4 pb-20 sm:p-6 md:overflow-auto md:px-12 lg:gap-8 [&:has([role=breadcrumbs])]:pt-4',
        className,
      )}
    >
      {children}
    </main>
  )
}

/* "max-w-[90rem]" */
