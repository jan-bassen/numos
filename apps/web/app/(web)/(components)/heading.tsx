import { cn } from '@repo/ui/lib/utils'

export function HomeHeading({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        'max-sm:max-w-[80vw] font-bold font-heading xs:font-semibold text-3xl xs:text-3xl md:text-4xl',
        className,
      )}
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
    <p
      className={cn(
        'max-sm:max-w-[80vw] text-pretty text-secondary-foreground/60 text-sm',
        className,
      )}
    >
      {children}
    </p>
  )
}
