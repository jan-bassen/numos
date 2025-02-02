import { Slot, Slottable } from '@radix-ui/react-slot'
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
        dialog: '!h-10 rounded-lg px-6',
        none: '',
      },
      effect: {
        expandIcon: 'group relative gap-0',
        ringHover:
          'transition-all duration-300 hover:ring-2 hover:ring-muted-foreground/50 hover:ring-offset-2',
        shine:
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          'before:animate-shine relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat background-position_0s_ease',
        shineHover:
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          'relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] before:duration-1000',
        gooeyRight:
          'before:-z-10 relative z-0 overflow-hidden from-white/40 transition-all duration-500 before:absolute before:inset-0 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:transition-transform before:duration-1000 hover:before:translate-x-[0%] hover:before:translate-y-[0%]',
        gooeyLeft:
          'after:-z-10 relative z-0 overflow-hidden from-white/40 transition-all duration-500 after:absolute after:inset-0 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:transition-transform after:duration-1000 hover:after:translate-x-[0%] hover:after:translate-y-[0%]',
        underline:
          '!no-underline relative after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0',
        hoverUnderline:
          '!no-underline relative after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100',
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

/* const Button = ({
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
 */

interface IconProps {
  icon: React.ElementType
  iconPlacement: 'left' | 'right'
  iconClassName?: string
}

interface IconRefProps {
  icon?: never
  iconPlacement?: undefined
  iconClassName?: string
}

export type ButtonIconProps = IconProps | IconRefProps

const Button = ({
  className,
  variant,
  effect,
  size,
  iconClassName,
  icon: Icon,
  iconPlacement,
  asChild = false,
  ...props
}: ButtonProps & ButtonIconProps) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className, effect }))}
      {...props}
    >
      {Icon &&
        iconPlacement === 'left' &&
        (effect === 'expandIcon' ? (
          <div className="w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2 group-hover:opacity-100">
            <Icon />
          </div>
        ) : (
          <Icon />
        ))}
      <Slottable>{props.children}</Slottable>
      {Icon &&
        iconPlacement === 'right' &&
        (effect === 'expandIcon' ? (
          <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
            <Icon className={iconClassName} />
          </div>
        ) : (
          <Icon />
        ))}
    </Comp>
  )
}

Button.displayName = 'Button'

export { Button, buttonVariants }
