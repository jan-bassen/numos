import { cn } from '@repo/ui/lib/utils'
import { Car } from 'lucide-react'
import type { ComponentProps, HTMLAttributes } from 'react'

const Card = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className,
    )}
    {...props}
  />
)
Card.displayName = 'Card'

const CardHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
)
CardHeader.displayName = 'CardHeader'

const CardTitle = ({ className, ...props }: ComponentProps<'h3'>) => (
  <h3
    className={cn(
      'font-semibold text-2xl leading-none tracking-tight',
      className,
    )}
    {...props}
  />
)
CardTitle.displayName = 'CardTitle'

const CardDescription = ({ className, ...props }: ComponentProps<'p'>) => (
  <p className={cn('text-muted-foreground text-sm', className)} {...props} />
)
CardDescription.displayName = 'CardDescription'

const CardContent = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
)
CardContent.displayName = 'CardContent'

const CardFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
