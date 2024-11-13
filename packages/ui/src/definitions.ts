import { cva } from 'class-variance-authority'

//Extra from shadcn ui:
// - Accordion Trigger with hideChevron
// - Select Stuff

export const buttonVariants = cva(
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

export const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const badgeVariants = cva(
  'inline-flex h-fit items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

export const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
