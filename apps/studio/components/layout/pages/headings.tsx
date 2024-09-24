import { cn } from '@/lib/utils'

export function H1({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h1 className={cn('font-bold text-4xl', className)}>{children}</h1>
}

export function H2({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h2 className={cn('font-semibold text-lg', className)}>{children}</h2>
}

export function H3({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3 className={cn('font-semibold text-base', className)}>{children}</h3>
  )
}
