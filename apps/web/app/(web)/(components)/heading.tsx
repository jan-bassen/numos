import { cn } from '@repo/ui/lib/utils'

export function HomeHeading({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        'font-bold -sm:max-w-[70vw] font-poppins xs:font-semibold text-3xl xs:text-3xl md:text-4xl',
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
        'text-pretty -sm:max-w-[70vw] text-secondary-foreground/60 text-sm',
        className,
      )}
    >
      {children}
    </p>
  )
}
