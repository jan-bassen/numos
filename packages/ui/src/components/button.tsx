import type * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@repo/ui/lib/utils'

const buttonVariants = cva(
  // biome-ignore lint/nursery/useSortedClasses: <explanation>
  "inline-flex cursor-pointer items-center justify-center gap-2 active:shadow-none whitespace-nowrap rounded-full text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'inset-shadow-reflection border border-primary-900 bg-gradient-to-t from-primary-700 to-primary-800 text-primary-foreground shadow-xs hover:from-primary-800 active:inset-shadow-reflection-hover active:translate-y-[0.5px] active:scale-[0.99] active:shadow-none',
        secondary:
          'inset-shadow-reflection border border-border bg-gradient-to-t from-secondary-500 to-secondary-600 text-secondary-foreground shadow-sm hover:from-secondary-600 active:inset-shadow-reflection-hover active:translate-y-[0.5px] active:scale-[0.99] active:shadow-none',
        destructive:
          'inset-shadow-reflection bg-gradient-to-t from-destructive-600 to-destructive-700 text-destructive-foreground shadow-xs hover:from-destructive-700 active:inset-shadow-reflection-hover active:translate-y-[0.5px] active:scale-[0.99] active:shadow-none',
        outline:
          'inset-shadow-reflection border border-border bg-background shadow-xs hover:bg-gradient-to-t hover:from-primary-50 hover:to-background active:translate-y-[0.5px] active:scale-[0.99] active:shadow-none',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary-700 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
