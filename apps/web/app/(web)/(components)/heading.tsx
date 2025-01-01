import { cn } from '@repo/ui/lib/utils'

export function HomeHeading({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <h1
      className={cn('font-bold font-poppins text-3xl md:text-4xl', className)}
    >
      {children}
    </h1>
  )
}

export function HomeDescription({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-pretty text-secondary-foreground/60', className)}>
      {children}
    </p>
  )
}
