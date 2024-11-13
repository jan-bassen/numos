import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        creative: 'bg-creative text-creative-foreground hover:bg-creative/90',
        muted: 'bg-muted text-muted-foreground',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        nav: 'border-input bg-background focus-visible:z-10 md:border md:hover:bg-accent md:hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'md:hover:bg-accent md:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        none: '',
      },
      size: {
        default: 'h-9 rounded-lg px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        md: 'h-10 rounded-lg px-4 py-2',
        lg: 'h-11 min-w-14 rounded-lg px-6 md:h-14',
        icon: 'size-10 rounded-lg',
        iconXs: 'h-4 w-4 rounded-md p-[1px]',
        iconSmall: 'h-6 w-6 rounded-lg p-1',
        iconMedium: 'h-8 w-8 rounded-lg p-1',
        action: 'h-6.5 w-6.5 rounded-full p-1.5',
        form: 'h-10 w-full rounded-lg font-normal md:max-w-[35rem]',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
Button.displayName = 'Button'

export { Button, buttonVariants }
