import {
  Button,
  buttonVariants,
  type ButtonProps,
} from '@repo/ui/components/ui/button'
import { PiAddAddStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import type { Icon } from '@repo/ui/types/icons'

export type ElementCardSize = keyof typeof elementCardSizeClasses
export type ElementCardVariant = keyof typeof elementCardButtonVariants

export type ElementCardExtra = {
  size: ElementCardSize
  variant?: ElementCardVariant
  label: string
  subtitle?: string | null
  icon?: Icon
  image?: ReactNode
}

const baseClasses = {
  card: 'flex !gap-2.5 p-3 items-center',
  content: 'flex flex-col gap-1 items-start justify-start w-full',
  label: '',
  subtitle: '',
  icon: 'my-auto size-4 [&>path]:!stroke-2',
  image: 'shrink-0 aspect-square overflow-hidden',
}
const elementCardSizeClasses = {
  sm: {
    card: 'h-14 justify-center py-1',
    label: 'font-medium',
    subtitle: 'hidden',
    image: 'size-10 rounded-sm',
  },
  md: {
    card: 'h-16 gap-0.5 justify-center py-0',
    label: '',
    subtitle: 'line-clamp-1 text-ellipsis',
    image: 'size-10 rounded-sm',
  },
  lg: {
    card: 'h-36 gap-4 py-3',
    label: '',
    subtitle: '',
    image: 'size-10 rounded-sm',
  },
}

const elementCardButtonVariants = {
  default: '',
  new: 'border-dashed bg-[hsl(var(--muted)/0.15)]',
}

function ElementCardLabel({
  className,
  children,
  size,
  ...props
}: ComponentProps<'h2'> & { size: ElementCardSize; image?: ReactNode }) {
  return (
    <h2
      className={cn(
        '!line-clamp-1 flex w-full justify-between overflow-hidden text-ellipsis pr-1 text-left font-semibold',
        elementCardSizeClasses[size].label,
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

function ElementCardSubtitle({
  className,
  children,
  size,
  ...props
}: ComponentProps<'p'> & { size: ElementCardSize }) {
  return (
    <p
      className={cn(
        'text-ellipsis font-normal text-muted-foreground text-xs',
        elementCardSizeClasses[size].subtitle,
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function ElementCardButton({
  className,
  size,
  label,
  subtitle,
  variant = 'default',
  icon,
  image,
  ...props
}: Omit<ButtonProps, keyof ElementCardExtra | 'variant'> & ElementCardExtra) {
  return (
    <Button
      variant={'outline'}
      className={cn(
        baseClasses.card,
        elementCardSizeClasses[size].card,
        elementCardButtonVariants[variant],
        className,
      )}
      {...props}
    >
      {image && (
        <div
          className={cn(baseClasses.image, elementCardSizeClasses[size].image)}
        >
          {image}
        </div>
      )}
      <div className={baseClasses.content}>
        <div className="flex w-full items-center gap-1.5">
          {variant === 'new' ? (
            <PiAddAddStroke className={baseClasses.icon} />
          ) : icon ? (
            icon({ className: baseClasses.icon })
          ) : null}
          <ElementCardLabel size={size}>{label}</ElementCardLabel>
        </div>
        <ElementCardSubtitle size={size}>{subtitle}</ElementCardSubtitle>
      </div>
    </Button>
  )
}

export function ElementCardLink({
  className,
  size,
  label,
  subtitle,
  variant = 'default',
  icon,
  image,
  ...props
}: ComponentProps<typeof Link> & ElementCardExtra) {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'outline' }),
        baseClasses.card,
        elementCardSizeClasses[size].card,
        elementCardButtonVariants[variant],
        className,
      )}
      {...props}
    >
      {image && (
        <div
          className={cn(baseClasses.image, elementCardSizeClasses[size].image)}
        >
          {image}
        </div>
      )}
      <div className={baseClasses.content}>
        <div className="flex w-full items-center gap-1.5">
          {variant === 'new' ? (
            <PiAddAddStroke className={baseClasses.icon} />
          ) : icon ? (
            icon({ className: baseClasses.icon })
          ) : null}
          <ElementCardLabel size={size}>{label}</ElementCardLabel>
        </div>
        <ElementCardSubtitle size={size}>{subtitle}</ElementCardSubtitle>
      </div>
    </Link>
  )
}
